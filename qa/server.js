// Lokale Testumgebung: echter API-Code der Repos + nachgebaute Datenbank + gebaute App.
// Aufruf: node server.js <pfad-zum-themes-repo> <port>
const http = require('http'); const fs = require('fs'); const path = require('path'); const esbuild = require('esbuild');
const repo = path.resolve(process.argv[2]); const port = parseInt(process.argv[3] || '4310', 10);
process.env.SUPABASE_URL = 'http://supabase.test'; process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.TOKEN_SECRET = 'test-token-secret-0123456789abcdef'; process.env.BREVO_API_KEY = 'test-brevo-key';
process.env.NODE_ENV = 'test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'; process.env.ADMIN_JWT_SECRET = 'test-admin-jwt-secret-0123456789';
const fake = require('./fake-supabase'); fake.install();
const fixtures = require('./fixtures');

function loadApi(rel) {
  const out = path.join(__dirname, '.bundle', rel.replace(/\//g, '_') + '.cjs');
  esbuild.buildSync({ entryPoints: [path.join(repo, rel)], bundle: true, platform: 'node', format: 'cjs', outfile: out, logLevel: 'silent' });
  delete require.cache[out]; const m = require(out); return m.default || m;
}
const isSA = fs.existsSync(path.join(repo, 'api/pinterest.js'));
const api = isSA ? { '/api/db': loadApi('api/db.js'), '/api/auth/verify': loadApi('api/auth/verify.js') } : { '/api/db': loadApi('api/db.js'), '/api/notify': loadApi('api/notify.js'), '/api/auth/verify': loadApi('api/auth/verify.js') };
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webp': 'image/webp', '.mp4': 'video/mp4' };
const build = path.join(repo, 'build');

http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'); let raw = '';
  for await (const c of req) raw += c;
  const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
  try {
    if (u.pathname === '/__test/reset') { fake.reset(); fixtures.seedAll(fake); if (isSA) fixtures.seedSuperAdmin(fake); return send(200, { ok: true }); }
    if (u.pathname === '/__test/db') return send(200, fake.db);
    if (u.pathname === '/__test/outbox') return send(200, { outbox: fake.outbox, blocked: fake.blocked });
    if (u.pathname === '/__test/seed') { const b = JSON.parse(raw); fake.seed(b.table, b.rows); return send(200, { ok: true }); }
    if (u.pathname === '/__test/mailfail') { fake.setMailFail(JSON.parse(raw)); return send(200, { ok: true }); }
    if (u.pathname === '/__test/fail') { fake.setFail(JSON.parse(raw)); return send(200, { ok: true }); }
    if (api[u.pathname]) {
      const r = { method: req.method, headers: req.headers, query: Object.fromEntries(u.searchParams), body: raw ? JSON.parse(raw) : {}, socket: req.socket, connection: req.socket, url: req.url };
      const w = { statusCode: 200, status(c) { this.statusCode = c; return this; }, setHeader(k, v) { res.setHeader(k, v); return this; },
        json(o) { res.statusCode = this.statusCode; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return this; },
        send(o) { res.statusCode = this.statusCode; res.end(typeof o === 'string' ? o : JSON.stringify(o)); return this; }, end(o) { res.statusCode = this.statusCode; res.end(o); return this; } };
      return await api[u.pathname](r, w);
    }
    if (u.pathname.startsWith('/api/')) return send(404, { error: 'API im Test nicht vorhanden' });
    let f = path.join(build, decodeURIComponent(u.pathname));
    if (!f.startsWith(build) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(build, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  } catch (e) { send(500, { error: String(e && e.message || e) }); }
}).listen(port, () => console.log('qa-server bereit auf ' + port));
