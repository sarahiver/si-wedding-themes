jest.mock('../../AdminContext', () => ({ useAdmin: () => ({}) }));
// eslint-disable-next-line import/first
import { summarizeExtras, buildExtrasCsv, csvCell, parseGuests, dietLabel } from '../RsvpExtrasPanel';

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
  expect(csv).toContain('"Cem";"ja";"7";"";"";"";"Deutsch"');
  expect(csv).toContain('"Dia";"ja";"0";"";"";"";"Deutsch"');
});
test('ohne Antworten: leere Kennzahlen', () => {
  expect(summarizeExtras(undefined)).toEqual({ children: [], byLang: {}, persons: 0, diets: {}, withAllergies: 0 });
});

// ---- Ernährung und Allergien je Person ----
const withDiet = [
  { name: 'Familie D', email: 'd@example.test', attending: true, persons: 3, language: 'fr', guests: [
    { name: 'Dana', diet: 'vegan', dietary: 'Vegan', allergies: '' },
    { name: 'Eli', diet: 'other', diet_note: 'kein Fisch', dietary: 'Sonstiges: kein Fisch', allergies: 'Nüsse; "Soja"' },
    { name: 'Fee', is_child: true, age: 4, diet: 'vegetarian', dietary: 'Vegetarisch', allergies: 'Laktose' }] },
  { name: 'Alt Eintrag', email: 'alt@example.test', attending: true, persons: 1, dietary: 'vegetarisch', allergies: 'Gluten', guests: null },
  { name: 'Absage', email: 'n@example.test', attending: false, persons: 1, guests: [{ name: 'Absage', diet: 'vegan', allergies: 'x' }] },
];
test('Ernährung je Person wird gezählt, Absagen zählen nicht', () => {
  const s = summarizeExtras(withDiet);
  expect(s.diets).toEqual({ Vegan: 1, Sonstiges: 1, Vegetarisch: 1 });
  expect(s.withAllergies).toBe(2);
});
test('Anzeigetext: Auswahl schlägt freien Text, „keine Besonderheiten" ist leer, ältere Einträge behalten ihren Text', () => {
  expect(dietLabel({ diet: 'vegan', dietary: 'egal' })).toBe('Vegan');
  expect(dietLabel({ diet: 'none', dietary: 'egal' })).toBe('');
  expect(dietLabel({ dietary: ' pescetarisch ' })).toBe('pescetarisch');
  expect(dietLabel(null)).toBe('');
});
test('Export: Ernährung, Hinweis und Allergien je Person; ältere Antwort in der ersten Zeile; Absage ohne Angaben', () => {
  const csv = buildExtrasCsv(withDiet);
  expect(csv.split('\n')[0]).toContain('"Ernährung";"Hinweis zur Ernährung";"Allergien und Unverträglichkeiten";"Sprache"');
  expect(csv).toContain('"Dana";"nein";"";"Vegan";"";"";"Französisch"');
  expect(csv).toContain('"Eli";"nein";"";"Sonstiges";"kein Fisch";"Nüsse; ""Soja""";"Französisch"');
  expect(csv).toContain('"Fee";"ja";"4";"Vegetarisch";"";"Laktose";"Französisch"');
  expect(csv).toContain('"Alt Eintrag";"nein";"";"vegetarisch";"";"Gluten";""');
  expect(csv).toContain('"Absage";"nein";"";"";"";"";""');
});
