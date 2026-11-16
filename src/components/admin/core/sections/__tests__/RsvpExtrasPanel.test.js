jest.mock('../../AdminContext', () => ({ useAdmin: () => ({}) }));
// eslint-disable-next-line import/first
import { summarizeExtras, buildExtrasCsv, csvCell, parseGuests } from '../RsvpExtrasPanel';

const rows = [
  { name: 'Familie A', email: 'a@example.test', attending: true, persons: 4, language: 'de', guests: [{ name: 'Anna' }, { name: 'Ben' }, { name: 'Cem', is_child: true, age: 7 }, { name: 'Dia', is_child: true, age: 0 }] },
  { name: 'B "Bo" C', email: 'b@example.test', attending: true, persons: 1, language: 'tr', guests: '[{"name":"Bo"}]' },
  { name: '=SUMME(A1)', email: 'c@example.test', attending: false, persons: 2, language: 'de', guests: [{ name: 'X', is_child: true, age: 3 }] },
];

test('Kinder nur aus Zusagen, nach Alter sortiert; Alter 0 bleibt erhalten', () => {
  const s = summarizeExtras(rows);
  expect(s.children.map((c) => c.age)).toEqual([0, 7]);
  expect(s.persons).toBe(5);
  expect(s.byLang).toEqual({ de: 2, tr: 1 });
});
test('Gästeliste als Text oder Liste; kaputte Daten ergeben eine leere Liste', () => {
  expect(parseGuests(rows[1])).toEqual([{ name: 'Bo' }]);
  expect(parseGuests({ guests: '{kaputt' })).toEqual([]);
  expect(parseGuests({})).toEqual([]);
});
test('CSV: Anführungszeichen verdoppelt, Formeln entschärft', () => {
  expect(csvCell('B "Bo" C')).toBe('"B ""Bo"" C"');
  expect(csvCell('=SUMME(A1)')).toBe('"\'=SUMME(A1)"');
  expect(csvCell(null)).toBe('""');
  const csv = buildExtrasCsv(rows);
  expect(csv.charCodeAt(0)).toBe(0xfeff);
  expect(csv.split('\n').length).toBe(1 + 4 + 1 + 1);
  expect(csv).toContain('"Cem";"ja";"7";"Deutsch"');
  expect(csv).toContain('"Dia";"ja";"0";"Deutsch"');
});
test('ohne Antworten: leere Kennzahlen', () => {
  expect(summarizeExtras(undefined)).toEqual({ children: [], byLang: {}, persons: 0 });
});
