// Nachbau der Supabase-REST-Schnittstelle im Arbeitsspeicher.
// Es wird NIE eine echte Datenbank und NIE ein echter Mailserver angesprochen:
// jeder fetch-Aufruf, der nicht hier beantwortet wird, schlägt fehl.
const crypto = require('crypto');
const BASE = 'http://supabase.test';
const db = {};          // tabelle -> zeilen
const outbox = [];      // abgefangene Brevo-Mails
const blocked = [];     // unerwartete Netzwerkaufrufe
let failNext = null; let mailFail = null; // { times, status, throw }    // { table, method, status } – simulierte DB-Fehler
// rsvp_responses: Nachbau des Teil-Index (project_id, dedupe_key) WHERE dedupe_key IS NOT NULL
const UNIQUE = { project_content: ['project_id', 'component'], guest_list: ['project_id', 'email'], rsvp_responses: ['project_id', 'dedupe_key'] };

function reset() { for (const k of Object.keys(db)) delete db[k]; outbox.length = 0; blocked.length = 0; failNext = null; mailFail = null; }
function table(t) { return (db[t] = db[t] || []); }
function seed(t, rows) { rows.forEach(r => table(t).push({ id: r.id || crypto.randomUUID(), created_at: new Date().toISOString(), ...r })); }

function parseFilters(params) {
  const fs = []; let order = null; let limit = null; let conflict = null;
  for (const [k, v] of params) {
    if (k === 'select') continue;
    if (k === 'order') { const [c, d] = v.split('.'); order = { c, desc: d === 'desc' }; continue; }
    if (k === 'limit') { limit = parseInt(v, 10); continue; }
    if (k === 'offset' || k === 'columns') continue;
    if (k === 'on_conflict') { conflict = v.split(','); continue; }
    const neg = v.startsWith('not.'); const vv = neg ? v.slice(4) : v;
    const m = vv.match(/^(eq|neq|gt|gte|lt|lte|like|ilike|is|in)\.(.*)$/s);
    if (!m || k === 'or' || k === 'and') throw new Error(`fake-supabase: Filter nicht unterstützt: ${k}=${v}`);
    const [, op, val] = m; let f;
    const lit = (x) => (x === 'null' ? null : x === 'true' ? true : x === 'false' ? false : x);
    const re = (p, fl) => new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/[%*]/g, '.*') + '$', fl);
    if (op === 'eq') f = r => String(r[k]) === val;
    else if (op === 'neq') f = r => String(r[k]) !== val;
    else if (op === 'in') { const list = val.replace(/^\(|\)$/g, '').split(',').map(x => x.replace(/^"|"$/g, '')); f = r => list.includes(String(r[k])); }
    else if (op === 'is') f = r => (r[k] === undefined ? null : r[k]) === lit(val);
    else if (op === 'like') f = r => re(val, '').test(String(r[k] ?? ''));
    else if (op === 'ilike') f = r => re(val, 'i').test(String(r[k] ?? ''));
    else f = r => { const a = r[k], b = isNaN(Number(val)) ? val : Number(val); return r[k] != null && (op === 'gt' ? a > b : op === 'gte' ? a >= b : op === 'lt' ? a < b : a <= b); };
    fs.push(neg ? (r => !f(r)) : f);
  }
  return { match: r => fs.every(f => f(r)), order, limit, conflict, hasFilter: fs.length > 0 };
}
const json = (status, body) => new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function rpc(fn, args) {
  const p = table('projects').find(r => r.slug === args.project_slug);
  if (fn === 'check_password_required') return json(200, { required: !!(p && p.password_protected) });
  const field = { verify_project_password: '_guest_pw', verify_preview_password: '_preview_pw', verify_admin_password: '_admin_pw' }[fn];
  if (!field) return json(404, { message: `rpc ${fn} unbekannt` });
  const ok = !!p && !!p[field] && p[field] === args.input_password;
  return json(200, ok ? { success: true } : { success: false, error: 'Falsches Passwort' });
}

async function handle(url, opt = {}) {
  const u = new URL(url);
  const method = (opt.method || 'GET').toUpperCase();
  const body = opt.body ? JSON.parse(typeof opt.body === 'string' ? opt.body : String(opt.body)) : null;
  const H = {}; if (opt.headers) { if (typeof opt.headers.forEach === 'function') opt.headers.forEach((v, k) => { H[k.toLowerCase()] = v; }); else for (const [k, v] of Object.entries(opt.headers)) H[k.toLowerCase()] = v; }
  const prefer = H.prefer || ''; const single = /vnd\.pgrst\.object/.test(H.accept || '');
  const one = (status, list) => (single ? (list.length === 1 ? json(status, list[0]) : json(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' })) : json(status, list));
  if (u.pathname.startsWith('/rest/v1/rpc/')) return rpc(u.pathname.split('/').pop(), body || {});
  const t = u.pathname.replace('/rest/v1/', '');
  if (failNext && failNext.table === t && failNext.method === method) { const f = failNext; failNext = null; return json(f.status || 500, { message: 'simulierter Datenbankfehler' }); }
  const q = parseFilters(u.searchParams);
  const rows = table(t);
  if (method === 'GET') {
    let out = rows.filter(q.match);
    if (q.order) out = [...out].sort((a, b) => (a[q.order.c] > b[q.order.c] ? 1 : a[q.order.c] < b[q.order.c] ? -1 : 0) * (q.order.desc ? -1 : 1));
    if (q.limit != null) out = out.slice(0, q.limit);
    return one(200, out);
  }
  if (method === 'POST') {
    const list = Array.isArray(body) ? body : [body];
    const out = [];
    for (const r of list) {
      const keys = q.conflict || null;
      const uniq = UNIQUE[t];
      const dupe = uniq && uniq.every(k => r[k] !== undefined && r[k] !== null) && rows.find(x => uniq.every(k => String(x[k]) === String(r[k])));
      if (dupe && keys && /merge-duplicates/.test(prefer)) { Object.assign(dupe, r); out.push(dupe); continue; }
      if (dupe) return json(409, { code: '23505', message: 'duplicate key value violates unique constraint' });
      const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...r };
      rows.push(row); out.push(row);
    }
    return /return=minimal/.test(prefer) || !/return=representation/.test(prefer) ? json(201) : one(201, out);
  }
  if (method === 'PATCH' || method === 'DELETE') {
    if (!q.hasFilter) return json(400, { message: 'Änderung ohne Filter abgelehnt' });
    const hit = rows.filter(q.match);
    if (method === 'PATCH') {
      const uniq = UNIQUE[t];
      if (uniq && uniq.every(k => body[k] !== undefined && body[k] !== null || hit.every(h => h[k] != null))) {
        for (const h of hit) { const next = { ...h, ...body }; if (uniq.every(k => next[k] != null) && rows.some(x => x !== h && uniq.every(k => String(x[k]) === String(next[k])))) return json(409, { code: '23505', message: 'duplicate key value violates unique constraint' }); }
      }
      hit.forEach(r => { for (const [k, v] of Object.entries(body)) if (v !== undefined) r[k] = v; });
    }
    else for (const r of hit) rows.splice(rows.indexOf(r), 1);
    return /return=minimal/.test(prefer) || !/return=representation/.test(prefer) ? json(204) : one(200, hit);
  }
  return json(405, { message: 'Methode nicht unterstützt' });
}

function install() {
  global.fetch = async (url, opt = {}) => {
    const s = String(url && url.url ? url.url : url);
    if (s.startsWith(BASE)) return handle(s, opt);
    if (s.includes('api.brevo.com')) { if (mailFail && mailFail.times > 0) { mailFail.times -= 1; if (mailFail.throw) throw new Error('simulierter Netzwerkfehler'); return json(mailFail.status || 500, { message: 'simulierter Brevo-Fehler' }); }
      outbox.push({ url: s, body: opt.body ? JSON.parse(opt.body) : null }); return json(201, { messageId: `test-${outbox.length}` }); }
    blocked.push(s);
    throw new Error(`Netzwerk im Test gesperrt: ${s}`);
  };
}
module.exports = { BASE, db, outbox, blocked, reset, seed, table, install, setFail: (f) => { failNext = f; }, setMailFail: (f) => { mailFail = f; } };
