// src/lib/guestMatch.js
// Abgleich der Gästeliste mit den RSVP-Antworten – über die E-Mail-Adresse und, wo keine vorliegt
// oder sie nicht passt, über die Namen.
//
// Grundsätze:
// - Die E-Mail-Adresse hat Vorrang und gilt als sicher.
// - Namen werden vor dem Vergleich vereinheitlicht (Groß-/Kleinschreibung, Akzente und Sonderzeichen wie
//   ş, ğ, ı, ü, ß, Titel, Reihenfolge von Vor- und Nachname).
// - Jede Person einer Antwort wird höchstens einem Eintrag der Gästeliste zugeordnet.
// - Nur eindeutige Treffer ändern den Status. Unsichere Treffer werden als Hinweis angezeigt, damit
//   niemand fälschlich als „zugesagt" gilt.

// Gäste ohne E-Mail-Adresse bekommen eine Platzhalter-Adresse, weil die Gästeliste je Projekt über die
// Adresse eindeutig ist. „.invalid" ist eine reservierte Endung, an die nie eine Mail zugestellt wird.
export const NO_EMAIL_DOMAIN = 'ohne-email.invalid';
export const hasRealEmail = (email) => typeof email === 'string' && email.includes('@') && !email.toLowerCase().endsWith('@' + NO_EMAIL_DOMAIN);

const SPECIAL = { ß: 'ss', ı: 'i', ø: 'o', æ: 'ae', œ: 'oe', ł: 'l', đ: 'd', ð: 'd', þ: 'th' };
// Wörter, die kein Namensbestandteil sind
const NOISE = new Set(['dr', 'prof', 'med', 'herr', 'frau', 'hr', 'fr', 'mr', 'mrs', 'ms', 'mme', 'bay', 'bayan', 'und', 'and', 'et', 've', 'u', 'familie', 'family', 'famille', 'ailesi', 'aile', 'mit', 'with', 'begleitung', 'partner', 'partnerin', 'kind', 'kinder', 'co']);

/** Name in vergleichbare Wortbestandteile zerlegen. */
export function nameTokens(name) {
  let s = String(name || '').toLowerCase().replace(/\([^)]*\)/g, ' ');
  s = s.replace(/[ßıøæœłđðþ]/g, (c) => SPECIAL[c] || c);
  s = s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const out = [];
  for (const t of s.replace(/[^a-z0-9]+/g, ' ').trim().split(' ')) if (t && !NOISE.has(t) && !out.includes(t)) out.push(t);
  return out;
}
export const normalizeName = (name) => nameTokens(name).join(' ');

/** Platzhalter-Adresse für einen Gast ohne E-Mail. `n` unterscheidet gleichnamige Gäste einer Liste. */
export function placeholderEmail(name, n = 1) {
  const base = nameTokens(name).join('.') || 'gast';
  return `${base}${n > 1 ? '.' + n : ''}@${NO_EMAIL_DOMAIN}`;
}

function editDistance(a, b) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 1) return 2;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let last = prev[0]; prev[0] = i;
    for (let j = 1; j <= b.length; j++) { const tmp = prev[j]; prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1)); last = tmp; }
  }
  return prev[b.length];
}
// Zwei Wörter gelten als gleich, wenn sie sich höchstens in einem Zeichen unterscheiden (Tippfehler, „ue" statt „ü")
const similar = (a, b) => a === b || (a.length >= 4 && b.length >= 4 && editDistance(a, b) <= 1) || (a.length >= 5 && b.length >= 5 && a.replace(/([aou])e/g, '$1') === b.replace(/([aou])e/g, '$1'));

/**
 * Wie gut passen zwei Namen? 3 = gleich, 2 = sehr wahrscheinlich dieselbe Person, 1 = möglich, 0 = nein.
 */
export function nameScore(a, b) {
  const A = Array.isArray(a) ? a : nameTokens(a); const B = Array.isArray(b) ? b : nameTokens(b);
  if (!A.length || !B.length) return 0;
  const [S, L] = A.length <= B.length ? [A, B] : [B, A];
  const used = new Set(); let exact = 0; let fuzzy = 0;
  for (const t of S) {
    let i = L.findIndex((x, k) => !used.has(k) && x === t);
    if (i >= 0) { used.add(i); exact++; continue; }
    i = L.findIndex((x, k) => !used.has(k) && similar(x, t));
    if (i >= 0) { used.add(i); fuzzy++; }
  }
  const hit = exact + fuzzy;
  if (hit < S.length) return 0;                       // ein Namensteil des kürzeren Namens fehlt im längeren
  if (S.length === L.length) {
    if (fuzzy === 0) return S.length >= 2 ? 3 : 2;      // gleich; ein einzelnes Wort („Oma") ist weniger eindeutig
    return S.length >= 2 && exact >= 1 ? 2 : 1;         // Tippfehler in einem Namensteil
  }
  return S.length >= 2 && fuzzy === 0 ? 2 : 1;          // „Anna Müller" in „Anna Maria Müller"; nur ein Wort: möglich
}

function parseGuests(r) {
  if (Array.isArray(r?.guests)) return r.guests;
  if (typeof r?.guests === 'string') { try { const g = JSON.parse(r.guests); return Array.isArray(g) ? g : []; } catch { return []; } }
  return [];
}

/** Alle namentlich bekannten Personen der Antworten. */
export function rsvpPersons(rsvpData) {
  const persons = [];
  (rsvpData || []).forEach((r) => {
    const seen = new Set();
    const add = (name, isMain) => { const tokens = nameTokens(name); const key = tokens.join(' '); if (!key || seen.has(key)) return; seen.add(key); persons.push({ rsvp: r, name: String(name).trim(), tokens, isMain }); };
    add(r.name, true);
    parseGuests(r).forEach((g) => { if (g && g.name) add(g.name, false); });
  });
  return persons;
}

/**
 * Gästeliste mit den Antworten abgleichen.
 * Zurück: { guests: [{ ...gast, status, via, match, hint }], unlisted: [{ name, rsvp, attending }] }
 * via: 'email' | 'name' | 'name-likely' | null. `hint` nennt einen möglichen, aber unsicheren Treffer.
 */
export function matchGuestList(guestList, rsvpData) {
  const persons = rsvpPersons(rsvpData);
  const used = new Set();
  const result = (guestList || []).map((g) => ({ ...g, status: 'pending', via: null, match: null, hint: null, _tokens: nameTokens(g.name) }));
  const assign = (g, p, via) => { used.add(p); g.status = p.rsvp.attending ? 'confirmed' : 'declined'; g.via = via; g.match = { name: p.name, rsvpName: p.rsvp.name, rsvpId: p.rsvp.id, attending: !!p.rsvp.attending }; g.rsvpMatch = p.rsvp; };

  // 1. E-Mail-Adresse
  for (const g of result) {
    if (!hasRealEmail(g.email)) continue;
    const mail = g.email.toLowerCase();
    const own = persons.filter((p) => !used.has(p) && (p.rsvp.email || '').toLowerCase() === mail);
    if (!own.length) continue;
    // In der Antwort die Person nehmen, deren Name am besten passt – sonst die Hauptperson
    const best = own.map((p) => [nameScore(g._tokens, p.tokens), p]).sort((a, b) => b[0] - a[0] || (b[1].isMain ? 1 : 0) - (a[1].isMain ? 1 : 0))[0][1];
    assign(g, best, 'email');
  }

  // 2. Namen: erst gleiche, dann sehr wahrscheinliche. Nur eindeutige Paare werden zugeordnet.
  for (const level of [3, 2]) {
    let changed = true;
    while (changed) {
      changed = false;
      const open = result.filter((g) => !g.via);
      const free = persons.filter((p) => !used.has(p));
      const pairs = [];
      for (const g of open) for (const p of free) if (nameScore(g._tokens, p.tokens) >= level) pairs.push([g, p]);
      for (const [g, p] of pairs) {
        if (g.via || used.has(p)) continue;
        const forGuest = pairs.filter(([gg, pp]) => gg === g && !used.has(pp));
        const forPerson = pairs.filter(([gg, pp]) => pp === p && !gg.via);
        // eindeutig, oder mehrere Personen derselben Antwort (dann ist der Status ohnehin derselbe)
        const sameReply = forGuest.every(([, pp]) => pp.rsvp === p.rsvp);
        if (forPerson.length === 1 && (forGuest.length === 1 || sameReply)) {
          assign(g, p, level === 3 ? 'name' : 'name-likely'); changed = true;
          // Ein Eintrag für mehrere Personen („Anna & Ben Müller"): die übrigen Personen derselben Antwort sind damit abgedeckt
          for (const [, pp] of forGuest) if (pp.rsvp === p.rsvp) used.add(pp);
        }
      }
    }
  }

  // 3. Hinweise für alles, was offen bleibt: mögliche Treffer nennen, ohne den Status zu ändern
  const free = persons.filter((p) => !used.has(p));
  for (const g of result) {
    if (g.via) continue;
    const cands = free.map((p) => [nameScore(g._tokens, p.tokens), p]).filter(([s]) => s >= 1).sort((a, b) => b[0] - a[0]);
    if (cands.length) g.hint = [...new Set(cands.slice(0, 3).map(([, p]) => p.name))];
  }
  for (const g of result) delete g._tokens;

  const unlisted = free.map((p) => ({ name: p.name, rsvpName: p.rsvp.name, rsvpId: p.rsvp.id, attending: !!p.rsvp.attending, isMain: p.isMain }));
  return { guests: result, unlisted };
}

export const VIA_LABEL = { email: 'über E-Mail', name: 'über den Namen', 'name-likely': 'über den Namen, bitte prüfen' };
