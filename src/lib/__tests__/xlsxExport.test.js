import * as XLSX from 'xlsx';
import { buildWorkbook, columnWidths } from '../xlsxExport';
import { buildRsvpRows, flattenRsvpData } from '../../components/admin/core/sections/RSVPSection';
import { buildExtrasRows } from '../../components/admin/core/sections/RsvpExtrasPanel';

jest.mock('../../components/admin/core/AdminContext', () => ({ useAdmin: () => ({}) }));
jest.mock('../supabase', () => ({}));

const RSVP = [
  { id: 1, name: 'Mehmet Demir', email: 'm@example.test', attending: true, persons: 3, dietary: '', allergies: '', message: '=HYPERLINK("http://x.test";"klick")', custom_answer: 'Bus', created_at: '2026-11-10T09:30:00Z', language: 'tr',
    guests: [{ name: 'Mehmet Demir', diet: 'none' }, { name: 'Elif Demir', diet: 'vegan', allergies: 'Nüsse', dietary: 'Vegan' }, { name: 'Can Demir', is_child: true, age: 6, diet: 'none' }] },
  { id: 2, name: 'Lena Koch', email: 'l@example.test', attending: false, persons: 1, created_at: '2026-11-11T18:00:00Z', language: 'de' },
];
const roundTrip = (sheets) => XLSX.read(XLSX.write(buildWorkbook(XLSX, sheets), { bookType: 'xlsx', type: 'array', cellDates: true }), { type: 'array', cellDates: true });

test('Antworten als Excel: eine Zeile je Person, Zahlen als Zahlen, Datum als Datum', () => {
  const rows = buildRsvpRows(flattenRsvpData(RSVP));
  const wb = roundTrip([{ name: 'Antworten', rows }]);
  expect(wb.SheetNames).toEqual(['Antworten']);
  const ws = wb.Sheets.Antworten;
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  expect(data[0]).toEqual(['Name', 'E-Mail', 'Personen', 'Status', 'Ernährung', 'Allergien', 'Custom Antwort', 'Nachricht', 'Datum']);
  expect(data.slice(1).map((r) => r[0])).toEqual(['Mehmet Demir', 'Elif Demir', 'Can Demir', 'Lena Koch']);
  expect(ws.C2).toMatchObject({ t: 'n', v: 3 });
  expect(ws.D5.v).toBe('Absage');
  expect(ws.I2.t).toBe('d');
  // Tagesdatum ohne Uhrzeit (auf eine Sekunde genau – die Bibliothek rundet Datumswerte minimal)
  const day = new Date(ws.I2.v.getTime() + 1000);
  expect([day.getFullYear(), day.getMonth() + 1, day.getDate()]).toEqual([2026, 11, 10]);
  expect(Math.abs(ws.I2.v.getHours() * 3600 + ws.I2.v.getMinutes() * 60 + ws.I2.v.getSeconds() - (ws.I2.v.getHours() > 12 ? 86400 : 0))).toBeLessThan(2);
  expect(ws['!autofilter'].ref).toBe('A1:I5');
});
test('ein Text, der wie eine Formel aussieht, bleibt Text', () => {
  const ws = roundTrip([{ name: 'A', rows: buildRsvpRows(flattenRsvpData(RSVP)) }]).Sheets.A;
  expect(ws.H2.t).toBe('s');
  expect(ws.H2.f).toBeUndefined();
  expect(ws.H2.v).toBe('=HYPERLINK("http://x.test";"klick")');
});
test('zweites Blatt „Gäste je Person" mit Kind, Alter, Ernährung und Sprache', () => {
  const wb = roundTrip([{ name: 'Antworten', rows: buildRsvpRows(flattenRsvpData(RSVP)) }, { name: 'Gäste je Person', rows: buildExtrasRows(RSVP) }]);
  expect(wb.SheetNames).toEqual(['Antworten', 'Gäste je Person']);
  const data = XLSX.utils.sheet_to_json(wb.Sheets['Gäste je Person'], { header: 1, defval: '' });
  expect(data).toHaveLength(5);
  expect(data[3].slice(4, 7)).toEqual(['Can Demir', 'ja', 6]);
  expect(data[2][7]).toBe('Vegan'); expect(data[2][9]).toBe('Nüsse'); expect(data[1][10]).toBe('Türkisch');
});
test('CSV-Fassung derselben Tabelle liefert Text und deutsches Datum', () => {
  const rows = buildRsvpRows(flattenRsvpData(RSVP), true);
  expect(typeof rows[1][8]).toBe('string');
  expect(rows[1][8]).toMatch(/^\d{1,2}\.\d{1,2}\.2026$/);
});
test('leere Tabelle, verbotene Zeichen im Blattnamen, Spaltenbreiten', () => {
  const wb = roundTrip([{ name: 'Gäste: [alle] / Test mit einem sehr langen Namen', rows: [['Name']] }]);
  expect(wb.SheetNames[0].length).toBeLessThanOrEqual(31);
  expect(wb.SheetNames[0]).not.toMatch(/[\\/?*[\]:]/);
  expect(columnWidths([['a', 'x'.repeat(200)], [null, 'y']])).toEqual([{ wch: 8 }, { wch: 60 }]);
});
