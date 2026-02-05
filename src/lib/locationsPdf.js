// src/lib/locationsPdf.js
// Shared PDF-Export für Locations – wird von allen Frontend-Themes genutzt

/**
 * Generiert eine druckbare HTML-Seite mit allen Locations und öffnet den Print-Dialog.
 * Funktioniert auf allen Geräten (Desktop + Mobile) ohne externe Libraries.
 *
 * @param {Array} locations - Array von Location-Objekten
 * @param {string} coupleName - z.B. "Anna & Tom"
 */
export function downloadLocationsPDF(locations, coupleName) {
  const typeLabels = { ceremony: 'Trauung', reception: 'Empfang', party: 'Feier' };

  const validLocs = (locations || []).filter(l => l.name);
  if (!validLocs.length) return;

  const safeName = (coupleName || 'Hochzeit').replace(/[<>&"]/g, '');

  const rows = validLocs.map(l => {
    const type = typeLabels[l.type] || l.type || '';
    const mapsUrl = l.maps_url || l.mapsUrl || (l.address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.address)}` : '');

    return `<tr>
      <td class="icon-cell">${l.icon || '📍'}</td>
      <td class="name-cell">
        <strong>${l.name}</strong>
        ${type || l.time ? `<br><span class="meta">${[type, l.time].filter(Boolean).join(' · ')}</span>` : ''}
      </td>
      <td class="addr-cell">
        ${l.address || '—'}
        ${mapsUrl ? `<br><a href="${mapsUrl}">→ Google Maps</a>` : ''}
      </td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Locations – ${safeName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @media print {
    body { margin: 0; }
    .no-print { display: none !important; }
    a { text-decoration: none; color: #111; }
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding: 2.5rem;
    color: #111;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.5;
  }
  h1 { font-size: 1.4em; font-weight: 600; margin-bottom: 0.2em; }
  .sub { color: #6b7280; font-size: 0.9em; margin-bottom: 2em; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 14px 16px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
  .icon-cell { font-size: 1.5em; text-align: center; width: 50px; }
  .name-cell strong { font-size: 1.05em; }
  .meta { color: #6b7280; font-size: 0.85em; }
  .addr-cell { color: #374151; font-size: 0.9em; }
  .addr-cell a { color: #2563eb; font-size: 0.85em; text-decoration: none; }
  .footer {
    margin-top: 3em; padding-top: 1em;
    border-top: 1px solid #e5e7eb;
    font-size: 0.75em; color: #9ca3af; text-align: center;
  }
  .print-btn {
    display: block; margin: 0 auto 2rem; padding: 0.75rem 2rem;
    background: #111; color: #fff; border: none; border-radius: 6px;
    font-size: 0.9rem; cursor: pointer; font-family: inherit;
  }
  .print-btn:hover { background: #333; }
</style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">📄 Als PDF speichern / Drucken</button>
  <h1>📍 Locations</h1>
  <p class="sub">${safeName}</p>
  <table>${rows}</table>
  <div class="footer">siwedding.de</div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
