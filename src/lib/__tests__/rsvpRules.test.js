// Prüfregeln des Servers für Projekte mit RSVP-Regeln – und Gleichlauf der E-Mail-Prüfung im Browser.
import { isPlausibleEmail as clientEmail } from '../email';

const rules = require('../../../api/lib/rsvpRules');
const R = rules.getRsvpRules({ rsvp: { max_persons: 8, child_ages: true, confirmation_mail: true }, i18n: { languages: ['en', 'tr', 'de', 'fr'], default: 'en' } });
const base = { name: 'Anna Test', email: 'anna@example.test', attending: true, persons: 1 };

const GOOD = ['a@b.de', 'max.mueller+hochzeit@example.co.uk', 'ayşe@örnek.com.tr', 'jörg@straße.example', "o'neil@ex-ample.org", 'x_y@sub.domain.museum', '  getrimmt@example.test  '];
const BAD = ['', ' ', 'a', 'a@', '@b.de', 'a@b', 'a b@c.de', 'a@b .de', 'a@@b.de', 'a@b@c.de', 'a@b..de', 'a@.de', 'a@b.', '.a@b.de', 'a.@b.de', 'a..b@c.de', 'a@b.c', 'a@b.123', 'a@-b.de', 'a@b-.de', 'a@b_c.de', 'a@b,de', null, undefined, 42];

describe('E-Mail-Prüfung', () => {
  test.each(GOOD)('gültig: %s', (v) => { expect(rules.isPlausibleEmail(v)).toBe(true); });
  test.each(BAD)('ungültig: %s', (v) => { expect(rules.isPlausibleEmail(v)).toBe(false); });
  test('Browser und Server urteilen bei jeder Adresse gleich', () => {
    [...GOOD, ...BAD].forEach((v) => expect(clientEmail(v)).toBe(rules.isPlausibleEmail(v)));
  });
  test('zu lange Adresse wird abgelehnt', () => { expect(rules.isPlausibleEmail(`${'a'.repeat(65)}@example.test`)).toBe(false); });
  test('Server: leer → email_required, falsche Form → email_invalid, Leerzeichen und Großschreibung werden bereinigt', () => {
    expect(rules.validateRsvp({ ...base, email: '   ' }, R).code).toBe('email_required');
    expect(rules.validateRsvp({ ...base, email: undefined }, R).code).toBe('email_required');
    expect(rules.validateRsvp({ ...base, email: 'anna@example' }, R).code).toBe('email_invalid');
    expect(rules.validateRsvp({ ...base, email: '  Anna@Example.TEST ' }, R).clean.email).toBe('anna@example.test');
  });
});

describe('Ernährung und Allergien je Person', () => {
  const three = { ...base, persons: 3, guests: [{ name: 'Anna Test', diet: 'vegan' }, { name: 'Ben', diet: 'none' }, { name: 'Cem', is_child: true, age: 6, diet: 'vegetarian' }] };
  test('Auswahl je Person wird gespeichert, Anzeigetext deutsch, keine Einwilligung nötig', () => {
    const v = rules.validateRsvp(three, R);
    expect(v.ok).toBe(true);
    expect(v.clean.guests.map((g) => [g.name, g.diet, g.dietary])).toEqual([['Anna Test', 'vegan', 'Vegan'], ['Ben', 'none', ''], ['Cem', 'vegetarian', 'Vegetarisch']]);
    expect(v.clean.guests[2]).toMatchObject({ is_child: true, age: 6 });
    expect(v.clean.guests[0].health_consent_at).toBeUndefined();
    // Felder der Antwort = Angaben der anmeldenden Person (für Tabelle und Filter im Dashboard)
    expect([v.clean.dietary, v.clean.allergies]).toEqual(['Vegan', '']);
  });
  test('unbekannte Ernährungsweise wird abgelehnt', () => {
    expect(rules.validateRsvp({ ...base, guests: [{ name: 'A', diet: 'fleisch' }] }, R).code).toBe('diet_invalid');
    expect(rules.validateRsvp({ ...base, guests: [{ name: 'A', diet: 7 }] }, R).code).toBe('diet_invalid');
  });
  test('Allergien nur mit Einwilligung; Zeitpunkt wird im Server festgehalten', () => {
    const data = { ...base, persons: 2, guests: [{ name: 'Anna Test' }, { name: 'Ben', allergies: 'Nüsse, Laktose' }] };
    expect(rules.validateRsvp(data, R)).toMatchObject({ ok: false, code: 'consent_required', field: 'health_consent' });
    expect(rules.validateRsvp({ ...data, health_consent: 'true' }, R).code).toBe('consent_required');
    const v = rules.validateRsvp({ ...data, health_consent: true }, R, { now: Date.UTC(2026, 10, 16, 12) });
    expect(v.ok).toBe(true);
    expect(v.clean.guests[1].allergies).toBe('Nüsse, Laktose');
    expect(v.clean.guests[0].health_consent_at).toBe('2026-11-16T12:00:00.000Z');
    expect(v.clean.allergies).toBe('');
  });
  test('„Sonstiges" mit Hinweis braucht Einwilligung; Hinweis nur bei „Sonstiges"', () => {
    expect(rules.validateRsvp({ ...base, guests: [{ name: 'A', diet: 'other', diet_note: 'kein Fisch' }] }, R).code).toBe('consent_required');
    const v = rules.validateRsvp({ ...base, health_consent: true, guests: [{ name: 'A', diet: 'other', diet_note: 'kein Fisch' }] }, R);
    expect(v.clean.guests[0]).toMatchObject({ diet: 'other', diet_note: 'kein Fisch', dietary: 'Sonstiges: kein Fisch' });
    const w = rules.validateRsvp({ ...base, guests: [{ name: 'A', diet: 'vegan', diet_note: 'wird verworfen' }] }, R);
    expect(w.ok).toBe(true); expect(w.clean.guests[0].diet_note).toBeUndefined();
    expect(rules.validateRsvp({ ...base, guests: [{ name: 'A', diet: 'other' }] }, R).clean.guests[0].dietary).toBe('Sonstiges');
  });
  test('acht Personen mit eigenen Angaben', () => {
    const guests = Array.from({ length: 8 }, (_, i) => ({ name: `P${i + 1}`, diet: ['none', 'vegetarian', 'vegan', 'other'][i % 4], allergies: i === 5 ? 'Gluten' : '' }));
    const v = rules.validateRsvp({ ...base, persons: 8, health_consent: true, guests }, R);
    expect(v.ok).toBe(true);
    expect(v.clean.guests.map((g) => g.dietary)).toEqual(['', 'Vegetarisch', 'Vegan', 'Sonstiges', '', 'Vegetarisch', 'Vegan', 'Sonstiges']);
    expect(v.clean.guests.findIndex((g) => g.allergies === 'Gluten')).toBe(5);
    expect(rules.validateRsvp({ ...base, persons: 9, guests: [...guests, { name: 'P9' }] }, R).code).toBe('persons_max');
  });
  test('Absage speichert keine Ernährungs- und Allergieangaben und braucht keine Einwilligung', () => {
    const v = rules.validateRsvp({ ...base, attending: false, guests: [{ name: 'A', diet: 'vegan', allergies: 'Nüsse' }] }, R);
    expect(v.ok).toBe(true);
    expect(v.clean.guests).toEqual([{ name: 'A', dietary: '', allergies: '' }]);
  });
  test('ältere Form (freier Text für die ganze Anmeldung) bleibt gültig und unverändert', () => {
    // Die Allergie an der Antwort selbst braucht seit der Vereinheitlichung dieselbe Einwilligung wie eine Angabe je Person
    const data = { ...base, persons: 2, dietary: 'vegetarisch', allergies: 'Laktose', guests: [{ name: 'A' }, { name: 'B' }] };
    expect(rules.validateRsvp(data, R).code).toBe('consent_required');
    const v = rules.validateRsvp({ ...data, health_consent: true }, R);
    expect(v.ok).toBe(true);
    expect([v.clean.dietary, v.clean.allergies]).toEqual(['vegetarisch', 'Laktose']);
    expect(v.clean.guests.every((g) => g.diet === undefined)).toBe(true);
  });
  test('Bearbeiten im Dashboard (ohne Gästeliste) verlangt keine Einwilligung', () => {
    // Der Server kennt die Anmeldung des Paares und schaltet die Einwilligung dafür ausdrücklich ab
    expect(rules.validateRsvp({ ...base, allergies: 'Nüsse', guests: undefined }, R, { requireHealthConsent: false }).ok).toBe(true);
    expect(rules.validateRsvp({ ...base, allergies: 'Nüsse', guests: undefined }, R).code).toBe('consent_required');
  });
  test('Längen werden begrenzt', () => {
    const v = rules.validateRsvp({ ...base, health_consent: true, guests: [{ name: 'A', diet: 'other', diet_note: 'x'.repeat(500), allergies: 'y'.repeat(900) }] }, R);
    expect(v.clean.guests[0].diet_note.length).toBe(200); expect(v.clean.guests[0].allergies.length).toBe(300);
  });
});
