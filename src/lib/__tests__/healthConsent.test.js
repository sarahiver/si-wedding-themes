// Einwilligung für Gesundheitsangaben in Projekten ohne RSVP-Regeln (alle Designs außer Cassis)
// und Lücken des bisherigen Regelpfads (Allergien an der Antwort selbst).
import { HEALTH_DIETS as clientDiets, needsHealthConsent } from '../../components/shared/RSVPCore';

const rules = require('../../../api/lib/rsvpRules');
const NOW = Date.UTC(2026, 10, 18, 9);
const AT = '2026-11-18T09:00:00.000Z';
const base = { name: 'Mara Beispiel', email: 'mara@example.test', attending: true, persons: 1, dietary: '', allergies: '', guests: [] };
const apply = (d, o) => rules.applyHealthConsent(d, { now: NOW, ...o });

describe('Projekt ohne Regeln', () => {
  test('ohne Allergien: keine Einwilligung nötig, Antwort bleibt unverändert', () => {
    expect(apply(base)).toEqual({ ok: true, data: { allergies: '', guests: [] } });
    expect(apply({ ...base, dietary: 'vegetarisch', guests: null })).toEqual({ ok: true, data: { allergies: '', guests: null } });
    expect(apply({ ...base, guests: undefined }).data.guests).toBeNull();
    // eine angekreuzte Einwilligung ohne Gesundheitsangabe hinterlässt keinen Vermerk
    expect(apply({ ...base, health_consent: true }).data.guests).toEqual([]);
  });

  test('Allergie ohne Einwilligung wird abgelehnt – auch bei manipulierten Werten', () => {
    for (const hc of [undefined, false, null, 'true', 1, 'yes', {}, []]) {
      expect(apply({ ...base, allergies: 'Nüsse', health_consent: hc })).toMatchObject({ ok: false, code: 'consent_required', field: 'health_consent' });
    }
  });

  test('Allergie mit Einwilligung: Zeitpunkt wird bei der ersten Person festgehalten', () => {
    const v = apply({ ...base, dietary: 'vegan', allergies: ' Nüsse ', health_consent: true });
    expect(v.ok).toBe(true);
    expect(v.data.allergies).toBe(' Nüsse ');
    expect(v.data.guests).toEqual([{ name: 'Mara Beispiel', dietary: 'vegan', allergies: 'Nüsse', health_consent_at: AT }]);
  });

  test('Allergie einer Begleitperson verlangt die Einwilligung; die Gästeliste bleibt sonst unverändert', () => {
    const guests = [{ name: '', dietary: '', allergies: '' }, { name: 'Jonas Muster', dietary: 'vegan', allergies: 'Laktose' }];
    expect(apply({ ...base, persons: 2, guests }).code).toBe('consent_required');
    const v = apply({ ...base, persons: 2, guests, health_consent: true });
    expect(v.data.guests).toEqual([{ name: '', dietary: '', allergies: '', health_consent_at: AT }, guests[1]]);
  });

  test('Auswahl „glutenfrei" und „laktosefrei" zählt wie eine Allergie-Angabe, „vegan" nicht', () => {
    expect(apply({ ...base, dietary: 'glutenfrei' }).code).toBe('consent_required');
    expect(apply({ ...base, dietary: 'Laktosefrei ' }).code).toBe('consent_required');
    expect(apply({ ...base, persons: 2, guests: [{}, { name: 'B', dietary: 'glutenfrei' }] }).code).toBe('consent_required');
    for (const d of ['vegan', 'vegetarisch', 'pescetarisch', 'andere', 'sonstiges', 'fleisch', '']) expect(apply({ ...base, dietary: d }).ok).toBe(true);
  });

  test('Absage: Allergie-Angaben werden nicht gespeichert, eine Einwilligung ist nicht nötig', () => {
    for (const att of [false, 'no', 'false']) {
      const v = apply({ ...base, attending: att, allergies: 'Nüsse', guests: [{ name: '', allergies: 'x' }, { name: 'B', dietary: 'vegan', allergies: 'Laktose' }] });
      expect(v).toEqual({ ok: true, data: { allergies: '', guests: [{ name: '', allergies: '' }, { name: 'B', dietary: 'vegan', allergies: '' }] } });
    }
  });

  test('Zusage als Text (Summer sendet „yes") wird wie eine Zusage behandelt', () => {
    expect(apply({ ...base, attending: 'yes', allergies: 'Nüsse' }).code).toBe('consent_required');
    expect(apply({ ...base, attending: 'yes', allergies: 'Nüsse', health_consent: true }).data.guests[0].health_consent_at).toBe(AT);
  });

  test('Eintrag des Paares im Dashboard: keine Einwilligung verlangt, kein Zeitpunkt vermerkt', () => {
    expect(apply({ ...base, allergies: 'Nüsse' }, { requireHealthConsent: false })).toEqual({ ok: true, data: { allergies: 'Nüsse', guests: [] } });
  });

  test('unerwartete Eingaben führen nicht zum Absturz', () => {
    expect(apply(null).ok).toBe(true);
    expect(apply({ attending: true, allergies: 42, guests: 'zwei' })).toEqual({ ok: true, data: { allergies: '', guests: 'zwei' } });
    expect(apply({ ...base, guests: [null, 'x', ['y']], allergies: 'Nüsse', health_consent: true }).data.guests[0]).toMatchObject({ name: 'Mara Beispiel', allergies: 'Nüsse', health_consent_at: AT });
    expect(rules.hasHealthData({ guests: [null, { allergies: '  ' }] })).toBe(false);
  });
});

describe('Projekt mit Regeln (Cassis): Allergien an der Antwort selbst', () => {
  const R = rules.getRsvpRules({ rsvp: { max_persons: 8 } });
  test('direkter Aufruf mit Allergie ohne Angaben je Person braucht jetzt die Einwilligung', () => {
    expect(rules.validateRsvp({ ...base, allergies: 'Nüsse', guests: undefined }, R).code).toBe('consent_required');
    const v = rules.validateRsvp({ ...base, allergies: 'Nüsse', guests: undefined, health_consent: true }, R, { now: NOW });
    expect(v.clean.allergies).toBe('Nüsse');
    expect(v.clean.guests).toEqual([{ name: 'Mara Beispiel', dietary: '', allergies: 'Nüsse', health_consent_at: AT }]);
  });
  test('Absage: Allergie an der Antwort wird nicht gespeichert', () => {
    const v = rules.validateRsvp({ ...base, attending: false, allergies: 'Nüsse', guests: undefined }, R);
    expect(v.ok).toBe(true); expect(v.clean.allergies).toBe(''); expect(v.clean.guests).toEqual([]);
  });
  test('Eintrag oder Änderung durch das Paar: ohne Einwilligung möglich, ohne Vermerk', () => {
    const v = rules.validateRsvp({ ...base, allergies: 'Nüsse', guests: undefined }, R, { requireHealthConsent: false });
    expect(v.ok).toBe(true); expect(v.clean.allergies).toBe('Nüsse'); expect(v.clean.guests).toEqual([]);
  });
  test('Angaben je Person verhalten sich wie bisher', () => {
    const g = [{ name: 'A', diet: 'vegan', allergies: 'Sellerie' }];
    expect(rules.validateRsvp({ ...base, guests: g }, R).code).toBe('consent_required');
    const v = rules.validateRsvp({ ...base, guests: g, health_consent: true }, R, { now: NOW });
    expect(v.clean).toMatchObject({ dietary: 'Vegan', allergies: 'Sellerie' });
    expect(v.clean.guests[0]).toMatchObject({ name: 'A', allergies: 'Sellerie', health_consent_at: AT });
  });
});

describe('Browser und Server', () => {
  test('dieselbe Liste gesundheitsbezogener Auswahlwerte', () => { expect(clientDiets).toEqual(rules.HEALTH_DIETS); });
  test('urteilen bei denselben Angaben gleich', () => {
    const cases = [
      { allergies: '', guests: [] }, { allergies: 'Nüsse', guests: [] }, { allergies: '   ', guests: [] }, { dietary: 'glutenfrei', guests: [] }, { dietary: 'vegan', guests: [] },
      { guests: [{ allergies: '' }, { allergies: 'Laktose' }] }, { guests: [{ dietary: 'laktosefrei' }] }, { guests: [{ diet: 'other', diet_note: 'kein Fisch' }] }, { guests: [{ diet: 'other', diet_note: ' ' }] }, { guests: null },
    ];
    cases.forEach((c) => expect(!!needsHealthConsent(c.guests, c)).toBe(rules.hasHealthData({ attending: true, ...c })));
  });
});
