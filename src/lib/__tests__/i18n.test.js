import { projectLanguages, pickLanguage, localizeContent } from '../i18n';

const four = { features: { i18n: { languages: ['en', 'tr', 'de', 'fr'], default: 'en' } } };

describe('projectLanguages', () => {
  test('Altprojekt ohne Einstellung bleibt einsprachig', () => {
    expect(projectLanguages({})).toEqual({ languages: [], master: null });
    expect(projectLanguages({ features: {} })).toEqual({ languages: [], master: null });
    expect(projectLanguages(null)).toEqual({ languages: [], master: null });
  });
  test('vier Sprachen, Englisch als Hauptsprache', () => {
    expect(projectLanguages(four)).toEqual({ languages: ['en', 'tr', 'de', 'fr'], master: 'en' });
  });
  test('unbekannte und doppelte Sprachen werden verworfen', () => {
    expect(projectLanguages({ features: { i18n: { languages: ['de', 'xx', 'de', 'fr'], default: 'xx' } } })).toEqual({ languages: ['de', 'fr'], master: 'de' });
  });
});

describe('pickLanguage', () => {
  const base = { languages: ['en', 'tr', 'de', 'fr'], master: 'en' };
  test('Gerätesprache zuerst, regionale Variante zählt', () => {
    expect(pickLanguage({ ...base, preferred: ['tr-TR', 'en'] })).toBe('tr');
    expect(pickLanguage({ ...base, preferred: ['fr-CA'] })).toBe('fr');
    expect(pickLanguage({ ...base, preferred: ['de'] })).toBe('de');
  });
  test('unbekannte Gerätesprache fällt auf Englisch', () => {
    expect(pickLanguage({ ...base, preferred: ['es-ES', 'it'] })).toBe('en');
    expect(pickLanguage({ ...base, preferred: [] })).toBe('en');
  });
  test('zweite Gerätesprache greift, wenn die erste fehlt', () => {
    expect(pickLanguage({ ...base, preferred: ['es', 'de-AT'] })).toBe('de');
  });
  test('bewusste Wahl schlägt die Gerätesprache; ungültige Wahl wird ignoriert', () => {
    expect(pickLanguage({ ...base, stored: 'fr', preferred: ['de'] })).toBe('fr');
    expect(pickLanguage({ ...base, stored: 'xx', preferred: ['de'] })).toBe('de');
  });
  test('ohne Sprachen: null', () => {
    expect(pickLanguage({ languages: [], master: null, preferred: ['de'] })).toBeNull();
  });
  test('ohne Englisch: Hauptsprache', () => {
    expect(pickLanguage({ languages: ['de', 'fr'], master: 'de', preferred: ['es'] })).toBe('de');
  });
});

describe('localizeContent', () => {
  const content = {
    title: 'Schedule', description: 'See you there', image: 'a.jpg', show: true,
    events: [{ time: '15:00', title: 'Ceremony' }, { time: '18:00', title: 'Dinner' }],
    i18n: { de: { title: 'Ablauf', description: '   ', events: [{ title: 'Trauung' }] }, fr: { title: '' } },
  };
  test('Hauptsprache: Inhalt unverändert, ohne den i18n-Schlüssel', () => {
    const out = localizeContent(content, 'en', 'en');
    expect(out.title).toBe('Schedule');
    expect(out.i18n).toBeUndefined();
  });
  test('Übersetzung überlagert, leere Texte fallen auf die Hauptsprache zurück', () => {
    const out = localizeContent(content, 'de', 'en');
    expect(out.title).toBe('Ablauf');
    expect(out.description).toBe('See you there');
  });
  test('Listen folgen der Hauptsprache; sprachneutrale Angaben bleiben', () => {
    const out = localizeContent(content, 'de', 'en');
    expect(out.events).toEqual([{ time: '15:00', title: 'Trauung' }, { time: '18:00', title: 'Dinner' }]);
    expect(out.image).toBe('a.jpg');
    expect(out.show).toBe(true);
  });
  test('Sprache ohne Übersetzung zeigt die Hauptsprache', () => {
    expect(localizeContent(content, 'tr', 'en').title).toBe('Schedule');
    expect(localizeContent(content, 'fr', 'en').title).toBe('Schedule');
  });
  test('Übersetzung kann Bilder oder Schalter nicht verändern', () => {
    const c = { image: 'a.jpg', show: true, n: 3, i18n: { de: { image: 'b.jpg', show: false, n: 9 } } };
    expect(localizeContent(c, 'de', 'en')).toEqual({ image: 'b.jpg', show: true, n: 3 });
  });
  test('einsprachiges Projekt und fehlender Inhalt', () => {
    expect(localizeContent({ title: 'Ablauf' }, null, null)).toEqual({ title: 'Ablauf' });
    expect(localizeContent(null, 'de', 'en')).toEqual({});
  });
});
