import { follows, previous, closingTone, transportKey, DEFAULT_ORDER, formatWeddingDay, heroTone } from '../helpers';

const all = () => true;
test('Standardreihenfolge: Antwortkarte folgt der Anfahrt, Fragen folgen den Trauzeug:innen', () => {
  expect(follows({}, all, 'directions', 'rsvp')).toBe(true);
  expect(follows({ component_order: [] }, all, 'witnesses', 'faq')).toBe(true);
  expect(DEFAULT_ORDER[0]).toBe('hero');
});
test('Frühere Reihenfolge: nichts wird zusammengelegt', () => {
  const p = { component_order: ['hero', 'timeline', 'countdown', 'rsvp', 'directions', 'faq', 'witnesses'] };
  expect(follows(p, all, 'directions', 'rsvp')).toBe(false);
  expect(follows(p, all, 'witnesses', 'faq')).toBe(false);
});
test('Unbekannte und ausgeschaltete Bereiche dazwischen zählen nicht', () => {
  const p = { component_order: ['hero', 'directions', 'childcare', 'gallery', 'rsvp', 'witnesses', 'faq'] };
  expect(follows(p, all, 'directions', 'rsvp')).toBe(true);
  expect(follows(p, (id) => id !== 'gallery', 'directions', 'rsvp')).toBe(true);
  const q = { component_order: ['hero', 'directions', 'timeline', 'rsvp'] };
  expect(follows(q, all, 'directions', 'rsvp')).toBe(false);
  expect(follows(q, (id) => id !== 'timeline', 'directions', 'rsvp')).toBe(true);
});
test('Ist ein Bereich ausgeschaltet oder fehlt er, gibt es keine gemeinsame Fläche', () => {
  expect(follows({}, (id) => id !== 'rsvp', 'directions', 'rsvp')).toBe(false);
  expect(follows({ component_order: ['hero', 'rsvp'] }, all, 'directions', 'rsvp')).toBe(false);
});
test('Wochentag und Datum in der Sprache der Seite', () => {
  expect(formatWeddingDay('2027-05-15', 'de')).toBe('Samstag, 15. Mai 2027');
  expect(formatWeddingDay('2027-05-15', 'fr')).toMatch(/^samedi 15 mai 2027$/);
  expect(formatWeddingDay('', 'de')).toBe('');
});

test('Ton der Schlussfläche: Blaugrau, außer direkt davor liegt schon Blaugrau', () => {
  expect(previous({}, all, 'witnesses')).toBe('dresscode');
  expect(closingTone({}, all, 'witnesses')).toBe('mist');
  // Hotels und Dresscode ausgeschaltet: die Antwortkarte liegt direkt davor
  expect(closingTone({}, (id) => id !== 'accommodations' && id !== 'dresscode', 'witnesses')).toBe('pearl');
  const old = { component_order: ['hero', 'timeline', 'countdown', 'rsvp', 'directions', 'faq', 'witnesses'] };
  expect(closingTone(old, all, 'faq')).toBe('pearl');
  expect(closingTone(old, all, 'witnesses')).toBe('pearl');
  expect(closingTone({ component_order: ['hero', 'faq', 'witnesses'] }, all, 'faq')).toBe('mist');
  expect(previous({}, all, 'gallery')).toBe('');
});
test('Anfahrt: Verkehrsmittel aus der Liste bekommen ihren Titel aus den Texten des Themes', () => {
  const { transportKey } = require('../helpers');
  expect(transportKey({ type: 'car', title: 'Auto', description: 'x' })).toBe('trCar');
  expect(transportKey({ type: 'train', title: '', description: 'x' })).toBe('trTrain');
  expect(transportKey({ description: 'x' })).toBe('trCar'); // neu angelegt, noch nichts gewählt
  // Eigener Titel bleibt
  expect(transportKey({ type: 'custom', title: 'Shuttle ab Marseille' })).toBeNull();
  expect(transportKey({ type: 'car', title: 'Mit dem Mietwagen' })).toBeNull();
  expect(transportKey({ title: 'Hotels' })).toBeNull();
});
test('Farbe des Schriftzugs: schwarz nur bei ausdrücklicher Wahl, sonst weiß', () => {
  expect(heroTone({ logo_color: 'black' })).toBe('dark');
  expect(heroTone({ logo_color: 'white' })).toBe('light');
  expect(heroTone({})).toBe('light');
  expect(heroTone(undefined)).toBe('light');
});
