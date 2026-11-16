// Vollständigkeit der festen Texte: jede Sprache kennt jeden Schlüssel, nichts ist leer.
import STRINGS, { LOCALES } from '../strings';

const langs = ['en', 'de', 'fr', 'tr'];
const keys = Object.keys(STRINGS.en);

test('vier Sprachen vorhanden, je mit Datumsformat', () => {
  expect(Object.keys(STRINGS).sort()).toEqual([...langs].sort());
  langs.forEach((l) => expect(typeof LOCALES[l]).toBe('string'));
});
test.each(langs)('%s: alle Schlüssel vorhanden und nicht leer', (l) => {
  expect(Object.keys(STRINGS[l]).sort()).toEqual([...keys].sort());
  keys.forEach((k) => expect(String(STRINGS[l][k]).trim().length).toBeGreaterThan(0));
});
test('Platzhalter stimmen in allen Sprachen überein', () => {
  const marks = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join();
  keys.forEach((k) => langs.forEach((l) => expect(`${k}:${marks(STRINGS[l][k])}`).toBe(`${k}:${marks(STRINGS.en[k])}`)));
});
test('neue RSVP-Texte sind übersetzt und nicht einfach englisch', () => {
  ['dietNone', 'dietVegetarian', 'dietOther', 'dietNote', 'allergiesPlaceholder', 'healthNote', 'consent', 'errConsent', 'errEmailInvalid'].forEach((k) => {
    ['de', 'fr', 'tr'].forEach((l) => expect(`${l}.${k}=${STRINGS[l][k]}`).not.toBe(`${l}.${k}=${STRINGS.en[k]}`));
  });
});
test('französische Akzente und türkische Sonderzeichen sind erhalten', () => {
  expect(STRINGS.fr.dietVegetarian).toBe('Végétarien');
  expect(STRINGS.fr.dietNote).toBe('Précisez');
  expect(STRINGS.tr.dietNone).toBe('Özel bir durum yok');
  expect(STRINGS.tr.dietOther).toBe('Diğer');
  expect(STRINGS.tr.allergiesPlaceholder).toMatch(/kuruyemiş/);
});
