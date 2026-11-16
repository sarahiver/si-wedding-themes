// Schriften des Cassis-Themes lokal ausliefern, damit Screenshots nicht vom Netz abhängen.
const fs = require('fs'); const path = require('path');
const F = (pkg, f) => path.join(__dirname, 'node_modules/@fontsource', pkg, 'files', f);
const FILES = {};
let css = '';
for (const w of [300, 400, 500]) for (const sub of ['latin', 'latin-ext']) {
  const name = `jost-${sub}-${w}-normal.woff2`; FILES[name] = F('jost', name);
  css += `@font-face{font-family:'Jost';font-weight:${w};font-style:normal;src:url(https://fonts.gstatic.com/qa/${name}) format('woff2');unicode-range:${sub === 'latin' ? 'U+0000-00FF,U+2013-2014,U+2018-201E,U+2026' : 'U+0100-02AF,U+1E00-1EFF'};}\n`;
}
for (const w of [300, 400]) for (const sub of ['latin', 'latin-ext']) {
  const name = `lato-${sub}-${w}-normal.woff2`; FILES[name] = F('lato', name);
  css += `@font-face{font-family:'Lato';font-weight:${w};font-style:normal;src:url(https://fonts.gstatic.com/qa/${name}) format('woff2');unicode-range:${sub === 'latin' ? 'U+0000-00FF,U+2013-2014,U+2018-201E,U+2026' : 'U+0100-02AF,U+1E00-1EFF'};}\n`;
}
for (const sub of ['latin', 'latin-ext']) {
  const name = `pinyon-script-${sub}-400-normal.woff2`; FILES[name] = F('pinyon-script', name);
  css += `@font-face{font-family:'Pinyon Script';font-weight:400;font-style:normal;src:url(https://fonts.gstatic.com/qa/${name}) format('woff2');unicode-range:${sub === 'latin' ? 'U+0000-00FF,U+2013-2014,U+2018-201E,U+2026' : 'U+0100-02AF,U+1E00-1EFF'};}\n`;
}
async function routeFonts(page) {
  await page.route((u) => u.hostname === 'fonts.googleapis.com', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'access-control-allow-origin': '*' }, body: css }));
  await page.route((u) => u.hostname === 'fonts.gstatic.com', (r) => { const f = FILES[path.basename(new URL(r.request().url()).pathname)]; return f ? r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) }) : r.abort(); });
}
module.exports = { routeFonts };
