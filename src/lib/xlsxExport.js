// src/lib/xlsxExport.js
// Tabellen als Excel-Datei (.xlsx) speichern. Die Bibliothek wird erst beim Export geladen.
//
// Texte bleiben Texte: Ein Inhalt wie „=SUMME(…)" wird als Zeichenkette gespeichert und von Excel
// nicht als Formel ausgeführt. Zahlen und Datumswerte bleiben sortier- und filterbar.

const isDate = (v) => v instanceof Date && !Number.isNaN(v.getTime());

/** Spaltenbreiten aus dem Inhalt schätzen (zwischen 8 und 60 Zeichen). */
export function columnWidths(rows) {
  const widths = [];
  rows.forEach((row) => row.forEach((cell, i) => {
    const len = isDate(cell) ? 10 : String(cell ?? '').split('\n').reduce((m, l) => Math.max(m, l.length), 0);
    widths[i] = Math.max(widths[i] || 8, Math.min(60, len + 2));
  }));
  return widths.map((wch) => ({ wch }));
}

/**
 * Arbeitsmappe aus Blättern bauen. sheets: [{ name, rows }] – die erste Zeile ist die Kopfzeile.
 * Zurück: die Mappe (für Tests) – `XLSX` wird übergeben, damit die Funktion ohne Nachladen prüfbar ist.
 */
export function buildWorkbook(XLSX, sheets) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, rows }) => {
    const data = rows.map((row) => row.map((c) => (c === null || c === undefined ? '' : c)));
    const ws = XLSX.utils.aoa_to_sheet(data, { cellDates: true });
    // Alle Texte ausdrücklich als Text kennzeichnen; Datumswerte im deutschen Format
    Object.keys(ws).forEach((ref) => {
      if (ref[0] === '!') return;
      const cell = ws[ref];
      if (cell.t === 'd') cell.z = 'dd.mm.yyyy';
      if (cell.t === 's') delete cell.f;
    });
    ws['!cols'] = columnWidths(data);
    if (data.length > 1) ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: data.length - 1, c: data[0].length - 1 } }) };
    // Blattnamen: höchstens 31 Zeichen, ohne die in Excel verbotenen Zeichen
    XLSX.utils.book_append_sheet(wb, ws, String(name).replace(/[\\/?*[\]:]/g, ' ').slice(0, 31));
  });
  return wb;
}

/** Datei im Browser speichern. */
export async function downloadXlsx(filename, sheets) {
  const XLSX = await import('xlsx');
  const wb = buildWorkbook(XLSX, sheets);
  const bytes = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellDates: true });
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const today = () => new Date().toISOString().slice(0, 10);
