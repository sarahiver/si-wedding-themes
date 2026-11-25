import * as XLSX from 'xlsx';
import { buildWorkbook, columnWidths } from '../xlsxExport';
import { buildRsvpRows, flattenRsvpData, parseGuests, dietLabel } from '../../components/admin/core/sections/RSVPSection';

jest.mock('../../components/admin/core/AdminContext', () => ({ useAdmin: () => ({}) }));
jest.mock('../supabase', () => ({}));

const RSVP = [
  { id: 1, name: 'Mehmet Demir', email: 'm@example.test', attending: true, persons: 3, dietary: '', allergies: '', message: '=HYPERLINK("http://x.test";"klick")', custom_answer: 'Bus', created_at: '2026-11-10T09:30:00Z', language: 'tr',
    guests: [{ name: 'Mehmet Demir', diet: 'none' }, { name: 'Elif Demir', diet: 'vegan', allergies: 'Nüsse', dietary: 'Vegan' }, { name: 'Can Demir', is_child: true, age: 6, diet: 'none' }] },
  { id: 2, name: 'Lena Koch', email: 'l@example.test', attending: false, persons: 1, created_at: '2026-11-11T18:00:00Z', language: 'de' },
];
const roundTrip = (sheets) => XLSX.read(XLSX.write(buildWorkbook(XLSX, sheets), { bookType: 'xlsx', type: 'array', cellDates: true }), { type: 'array', cellDates: true });

test('Antworten als Excel: eine Zeile je Person mit allen Angaben, Zahlen als Zahlen, Datum als Datum', () => {
  const rows = buildRsvpRows(flattenRsvpData(RSVP));
  const wb = roundTrip([{ name: 'Antworten', rows }]);
  expect(wb.SheetNames).toEqual(['Antworten']);
  const ws = wb.Sheets.Antworten;
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  expect(data[0]).toEqual(['Name', 'Anmeldung', 'E-Mail', 'Personen', 'Status', 'Kind', 'Alter', 'Ernährung', 'Hinweis zur Ernährung', 'Allergien', 'Custom Antwort', 'Nachricht', 'Sprache', 'Datum']);
  expect(data.slice(1).map((r) => r[0])).toEqual(['Mehmet Demir', 'Elif Demir', 'Can Demir', 'Lena Koch']);
  expect(ws.D2).toMatchObject({ t: 'n', v: 3 });
  expect(ws.E5.v).toBe('Absage');
  // Begleitpersonen: Anmeldung, E-Mail und Sprache der Antwort; Kind mit Alter als Zahl
  expect(data[2].slice(0, 3)).toEqual(['Elif Demir', 'Mehmet Demir', 'm@example.test']);
  expect(data[2].slice(7, 10)).toEqual(['Vegan', '', 'Nüsse']);
  expect(data[3].slice(5, 7)).toEqual(['ja', 6]);
  expect(ws.G4).toMatchObject({ t: 'n', v: 6 });
  expect(data[1][5]).toBe('nein');
  expect(data[1][12]).toBe('Türkisch'); expect(data[4][12]).toBe('Deutsch');
  expect(ws.N2.t).toBe('d');
  // Tagesdatum ohne Uhrzeit (auf eine Sekunde genau – die Bibliothek rundet Datumswerte minimal)
  const day = new Date(ws.N2.v.getTime() + 1000);
  expect([day.getFullYear(), day.getMonth() + 1, day.getDate()]).toEqual([2026, 11, 10]);
  expect(Math.abs(ws.N2.v.getHours() * 3600 + ws.N2.v.getMinutes() * 60 + ws.N2.v.getSeconds() - (ws.N2.v.getHours() > 12 ? 86400 : 0))).toBeLessThan(2);
  expect(ws['!autofilter'].ref).toBe('A1:N5');
});
test('Ernährung je Person: Auswahl, Hinweis und Allergien; ältere Antwort behält ihren Text', () => {
  const rows = buildRsvpRows(flattenRsvpData([
    { id: 3, name: 'Eli', attending: true, persons: 2, created_at: '2026-11-12T10:00:00Z',
      guests: [{ name: 'Eli', diet: 'other', diet_note: 'kein Fisch', dietary: 'Sonstiges: kein Fisch', allergies: 'Laktose' }, { name: 'Fee', diet: 'none', dietary: 'egal' }] },
    { id: 4, name: 'Alt Eintrag', attending: true, persons: 1, dietary: 'vegetarisch', allergies: 'Gluten', guests: null, created_at: '2026-11-12T10:00:00Z' },
  ]));
  expect(rows[1].slice(7, 10)).toEqual(['Sonstiges', 'kein Fisch', 'Laktose']);
  expect(rows[2].slice(7, 10)).toEqual(['', '', '']);
  expect(rows[3].slice(7, 10)).toEqual(['vegetarisch', '', 'Gluten']);
});
test('ein Text, der wie eine Formel aussieht, bleibt Text', () => {
  const ws = roundTrip([{ name: 'A', rows: buildRsvpRows(flattenRsvpData(RSVP)) }]).Sheets.A;
  expect(ws.L2.t).toBe('s');
  expect(ws.L2.f).toBeUndefined();
  expect(ws.L2.v).toBe('=HYPERLINK("http://x.test";"klick")');
});
test('Gästeliste als Text oder Liste; kaputte Daten ergeben eine leere Liste', () => {
  expect(parseGuests({ guests: '[{"name":"Bo"}]' })).toEqual([{ name: 'Bo' }]);
  expect(parseGuests({ guests: '{kaputt' })).toEqual([]);
  expect(parseGuests({})).toEqual([]);
  expect(dietLabel({ diet: 'vegan', dietary: 'egal' })).toBe('Vegan');
  expect(dietLabel({ dietary: ' pescetarisch ' })).toBe('pescetarisch');
  expect(dietLabel(null)).toBe('');
});
test('CSV-Fassung derselben Tabelle liefert Text und deutsches Datum', () => {
  const rows = buildRsvpRows(flattenRsvpData(RSVP), true);
  expect(typeof rows[1][13]).toBe('string');
  expect(rows[1][13]).toMatch(/^\d{1,2}\.\d{1,2}\.2026$/);
  expect(rows[3][6]).toBe('6');
});
test('leere Tabelle, verbotene Zeichen im Blattnamen, Spaltenbreiten', () => {
  const wb = roundTrip([{ name: 'Gäste: [alle] / Test mit einem sehr langen Namen', rows: [['Name']] }]);
  expect(wb.SheetNames[0].length).toBeLessThanOrEqual(31);
  expect(wb.SheetNames[0]).not.toMatch(/[\\/?*[\]:]/);
  expect(columnWidths([['a', 'x'.repeat(200)], [null, 'y']])).toEqual([{ wch: 8 }, { wch: 60 }]);
});
