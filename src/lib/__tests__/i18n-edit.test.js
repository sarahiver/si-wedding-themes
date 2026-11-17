import { diffTranslation, listStructureChanged, realignTranslations, withTranslation, localizeContent , pruneBlankTranslations, neutralChanged, hasOwnText, localizeContent as localize2 } from '../i18n';

test('Nur abweichende Texte werden als Übersetzung gespeichert', () => {
  expect(diffTranslation('Schedule', 'Ablauf')).toBe('Ablauf');
  expect(diffTranslation('Schedule', 'Schedule')).toBeUndefined();
  expect(diffTranslation('Schedule', '  ')).toBe(''); // geleert: bleibt beim Bearbeiten leer, wird nicht gespeichert
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
test('Hotels und Dresscode: Codes, Links und Farbwerte gelten für alle Sprachen; die Preisangabe ist Text', () => {
  const hotels = [{ name: 'Hôtel A', distance: '10 min walk', booking_code: 'ABC', price_range: '€€', maps_url: 'https://example.test/m' }];
  const edited = [{ name: 'Hôtel A', distance: '10 Minuten zu Fuß', booking_code: 'XYZ', price_range: '€', maps_url: 'https://example.test/x' }];
  expect(diffTranslation(hotels, edited)).toEqual([{ distance: '10 Minuten zu Fuß', price_range: '€' }]);
  expect(diffTranslation([{ hex: '#9A9FAD', name: 'Blue grey' }], [{ hex: '#000000', name: 'Blaugrau' }])).toEqual([{ name: 'Blaugrau' }]);
  expect(diffTranslation('Black tie optional', 'Festlich elegant')).toBe('Festlich elegant'); // Feld „code" des Dresscodes ist Text
  expect(diffTranslation(['Long dresses'], ['Lange Kleider'])).toEqual(['Lange Kleider']);
});

test('Feld in einer Übersetzung leeren: bleibt beim Bearbeiten leer, auf der Seite gilt die Hauptsprache, gespeichert wird nichts Leeres', () => {
  expect(diffTranslation('Timeline', '')).toBe('');
  expect(diffTranslation('', '')).toBeUndefined();
  expect(diffTranslation([{ title: 'A', time: '15:00' }, { title: 'B' }], [{ title: '', time: '15:00' }, { title: 'B' }])).toEqual([{ title: '' }, null]);
  const content = { title: 'Timeline', events: [{ title: 'A' }], i18n: { de: { title: '', events: [{ title: '' }] }, fr: { title: 'Programme' } } };
  expect(localize2(content, 'de', 'en', true).title).toBe('');           // Dashboard: Feld bleibt leer
  expect(localize2(content, 'de', 'en', true).events[0].title).toBe('');
  expect(localize2(content, 'de', 'en').title).toBe('Timeline');         // Seite: Hauptsprache
  expect(pruneBlankTranslations(content)).toEqual({ title: 'Timeline', events: [{ title: 'A' }], i18n: { fr: { title: 'Programme' } } });
  expect(pruneBlankTranslations({ title: 'x', i18n: { de: { title: ' ' } } })).toEqual({ title: 'x' });
  const untouched = { title: 'x' }; expect(pruneBlankTranslations(untouched)).toBe(untouched);
});
test('Sprachneutrale Felder: Änderung in einer Übersetzung wird erkannt', () => {
  expect(neutralChanged([{ time: '15:00', title: 'A' }], [{ time: '16:00', title: 'A' }], 'events')).toBe(true);
  expect(neutralChanged([{ time: '15:00', title: 'A' }], [{ time: '15:00', title: 'B' }], 'events')).toBe(false);
  expect(neutralChanged('+49 1', '+49 2', 'phone')).toBe(true);
  expect(neutralChanged('Titel', 'Anders', 'title')).toBe(false);
  expect(neutralChanged([{ price_range: '€€' }], [{ price_range: 'ab 180 €' }], 'hotels')).toBe(false);
});
test('Eigene Überschrift je Sprache: nur wenn in dieser Sprache eingetragen', () => {
  const c = { title: 'Getting there', i18n: { de: { title: 'So kommt ihr hin' }, fr: { title: '  ' } } };
  expect(hasOwnText(c, 'en', 'en', 'title')).toBe(true);
  expect(hasOwnText(c, 'de', 'en', 'title')).toBe(true);
  expect(hasOwnText(c, 'fr', 'en', 'title')).toBe(false);
  expect(hasOwnText(c, 'tr', 'en', 'title')).toBe(false);
  expect(hasOwnText({ i18n: {} }, 'en', 'en', 'title')).toBe(false);
});
