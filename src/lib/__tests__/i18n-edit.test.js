import { diffTranslation, listStructureChanged, realignTranslations, withTranslation, localizeContent } from '../i18n';

test('Nur abweichende Texte werden als Übersetzung gespeichert', () => {
  expect(diffTranslation('Schedule', 'Ablauf')).toBe('Ablauf');
  expect(diffTranslation('Schedule', 'Schedule')).toBeUndefined();
  expect(diffTranslation('Schedule', '  ')).toBeUndefined();
  expect(diffTranslation(undefined, 'Neu')).toBe('Neu');
  expect(diffTranslation(true, false)).toBeUndefined();
  expect(diffTranslation(3, 4)).toBeUndefined();
});
test('Listen: Länge und Reihenfolge der Hauptsprache, Uhrzeiten bleiben sprachneutral', () => {
  const base = [{ time: '15:00', title: 'Ceremony' }, { time: '18:00', title: 'Dinner' }];
  const edited = [{ time: '15:00', title: 'Trauung' }, { time: '19:00', title: 'Dinner' }];
  expect(diffTranslation(base, edited)).toEqual([{ title: 'Trauung' }, null]);
  expect(diffTranslation(base, base.map((x) => ({ ...x })))).toBeUndefined();
});
test('Gespeicherte Übersetzung ergibt beim Anzeigen wieder die bearbeitete Fassung', () => {
  const content = { title: 'Schedule', events: [{ time: '15:00', title: 'Ceremony' }, { time: '18:00', title: 'Dinner' }] };
  const view = { title: 'Ablauf', events: [{ time: '15:00', title: 'Trauung' }, { time: '18:00', title: 'Dinner' }] };
  let c = withTranslation(content, 'de', 'title', diffTranslation(content.title, view.title));
  c = withTranslation(c, 'de', 'events', diffTranslation(content.events, view.events));
  expect(c.i18n).toEqual({ de: { title: 'Ablauf', events: [{ title: 'Trauung' }, null] } });
  expect(localizeContent(c, 'de', 'en')).toEqual(view);
  expect(localizeContent(c, 'fr', 'en')).toEqual(content);
  // Übersetzung wieder leeren: der Eintrag verschwindet vollständig
  c = withTranslation(c, 'de', 'title', undefined); c = withTranslation(c, 'de', 'events', undefined);
  expect(c.i18n).toBeUndefined();
});
test('Strukturänderung einer Liste wird erkannt', () => {
  const a = { t: 1 }, b = { t: 2 }, c = { t: 3 };
  expect(listStructureChanged([a, b], [a, b])).toBe(false);
  expect(listStructureChanged([a, b], [a, { t: 9 }])).toBe(false); // ein Eintrag bearbeitet
  expect(listStructureChanged([a, b], [a])).toBe(true);
  expect(listStructureChanged([a, b], [a, b, c])).toBe(true);
  expect(listStructureChanged([a, b], [b, a])).toBe(true);
});
test('Übersetzungen wandern beim Löschen, Hinzufügen und Verschieben mit', () => {
  const a = { title: 'A' }, b = { title: 'B' }, c = { title: 'C' }, n = { title: 'New' };
  const tr = [{ title: 'a-de' }, null, { title: 'c-de' }];
  expect(realignTranslations([a, b, c], [a, c], tr)).toEqual([{ title: 'a-de' }, { title: 'c-de' }]);
  expect(realignTranslations([a, b, c], [c, a, b], tr)).toEqual([{ title: 'c-de' }, { title: 'a-de' }, null]);
  expect(realignTranslations([a, b, c], [a, b, c, n], tr)).toEqual([{ title: 'a-de' }, null, { title: 'c-de' }, null]);
  expect(realignTranslations([a, b, c], [b], tr)).toBeUndefined();
});
