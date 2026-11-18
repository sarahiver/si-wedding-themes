import { nameTokens, normalizeName, nameScore, matchGuestList, placeholderEmail, hasRealEmail, rsvpPersons } from '../guestMatch';

const G = (name, email, extra = {}) => ({ id: name, name, email: email || placeholderEmail(name), ...extra });
const R = (name, email, attending = true, guests = []) => ({ id: 'r-' + name, name, email: email || '', attending, persons: Math.max(1, guests.length), guests });
const byName = (res) => Object.fromEntries(res.guests.map((g) => [g.name, g]));

describe('Namen vereinheitlichen', () => {
  test('Groß-/Kleinschreibung, Akzente, türkische und deutsche Sonderzeichen', () => {
    expect(normalizeName('  Olgu  DURMAZ ')).toBe('olgu durmaz');
    expect(normalizeName('Ayşe Yılmaz-Öztürk')).toBe('ayse yilmaz ozturk');
    expect(normalizeName('İbrahim Çağlar')).toBe('ibrahim caglar');
    expect(normalizeName('Jürgen Weiß')).toBe('jurgen weiss');
    expect(normalizeName('Zoé Lefèvre')).toBe('zoe lefevre');
  });
  test('Titel, Füllwörter, Klammern und Satzzeichen fallen weg; Reihenfolge ist egal', () => {
    expect(nameTokens('Dr. med. Anna Müller (Tante)')).toEqual(['anna', 'muller']);
    expect(nameTokens('Familie Yılmaz')).toEqual(['yilmaz']);
    expect(nameScore('Durmaz, Olgu', 'Olgu Durmaz')).toBe(3);
    expect(nameTokens('Anna & Ben Müller')).toEqual(['anna', 'ben', 'muller']);
  });
});

describe('Wie gut passen zwei Namen?', () => {
  test('gleich = 3', () => { expect(nameScore('Emre Gücer', 'emre gucer')).toBe(3); });
  test('zusätzlicher Vorname oder Doppelname = 2', () => {
    expect(nameScore('Anna Müller', 'Anna Maria Müller')).toBe(2);
    expect(nameScore('Ayşe Yılmaz', 'Ayşe Yılmaz Öztürk')).toBe(2);
  });
  test('Tippfehler oder „ue" statt „ü" in einem Namensteil = 2', () => {
    expect(nameScore('Anna Mueller', 'Anna Müller')).toBe(2);
    expect(nameScore('Stefan Schmidt', 'Stefan Schmitt')).toBe(2);
  });
  test('nur ein gemeinsames Wort = höchstens möglich', () => {
    expect(nameScore('Familie Yılmaz', 'Ayşe Yılmaz')).toBe(1);
    expect(nameScore('Anna', 'Anna Müller')).toBe(1);
    expect(nameScore('Oma', 'Oma')).toBe(2);
  });
  test('verschiedene Personen = 0', () => {
    expect(nameScore('Anna Müller', 'Anna Schmidt')).toBe(0);
    expect(nameScore('Ali Yılmaz', 'Veli Yılmaz')).toBe(0);
    expect(nameScore('Tim Roth', 'Tom Roth')).toBe(0); // kurze Namen: kein Tippfehler-Ausgleich
    expect(nameScore('', 'Anna')).toBe(0);
  });
});

describe('Abgleich Gästeliste – Antworten', () => {
  test('E-Mail hat Vorrang, auch wenn der Name anders geschrieben ist', () => {
    const res = byName(matchGuestList([G('Anna Müller', 'anna@example.test')], [R('A. Mueller-Schmidt', 'ANNA@example.test')]));
    expect(res['Anna Müller']).toMatchObject({ status: 'confirmed', via: 'email' });
  });
  test('ohne E-Mail: gleicher Name ergibt den Status der Antwort', () => {
    const res = byName(matchGuestList([G('Olgu Durmaz'), G('Emre Gücer'), G('Selin Kaya')], [R('olgu durmaz', 'o@example.test'), R('Emre Gucer', 'e@example.test', false)]));
    expect(res['Olgu Durmaz']).toMatchObject({ status: 'confirmed', via: 'name' });
    expect(res['Emre Gücer']).toMatchObject({ status: 'declined', via: 'name' });
    expect(res['Selin Kaya']).toMatchObject({ status: 'pending', via: null, hint: null });
  });
  test('Begleitpersonen einer Antwort zählen mit', () => {
    const r = R('Mehmet Demir', 'm@example.test', true, [{ name: 'Mehmet Demir' }, { name: 'Elif Demir' }, { name: 'Can Demir', is_child: true, age: 6 }]);
    const out = matchGuestList([G('Elif Demir'), G('Mehmet Demir')], [r]);
    const res = byName(out);
    expect(res['Elif Demir']).toMatchObject({ status: 'confirmed', via: 'name' });
    expect(res['Elif Demir'].match).toMatchObject({ name: 'Elif Demir', rsvpName: 'Mehmet Demir' });
    expect(out.unlisted.map((p) => p.name)).toEqual(['Can Demir']);
  });
  test('ähnlicher Name wird zugeordnet, aber zum Prüfen markiert', () => {
    const res = byName(matchGuestList([G('Anna Müller'), G('Stefan Schmidt')], [R('Anna Maria Müller', 'x@example.test'), R('Stefan Schmitt', 's@example.test', false)]));
    expect(res['Anna Müller']).toMatchObject({ status: 'confirmed', via: 'name-likely' });
    expect(res['Stefan Schmidt']).toMatchObject({ status: 'declined', via: 'name-likely' });
  });
  test('zwei Abweichungen zugleich (zusätzlicher Vorname und andere Schreibweise): nur Hinweis', () => {
    const res = byName(matchGuestList([G('Anna Müller')], [R('Anna Maria Mueller', 'x@example.test')]));
    expect(res['Anna Müller']).toMatchObject({ status: 'pending', via: null, hint: ['Anna Maria Mueller'] });
  });
  test('nur ein gemeinsames Wort ändert den Status nicht, gibt aber einen Hinweis', () => {
    const res = byName(matchGuestList([G('Familie Yılmaz')], [R('Ayşe Yılmaz', 'a@example.test')]));
    expect(res['Familie Yılmaz']).toMatchObject({ status: 'pending', via: null, hint: ['Ayşe Yılmaz'] });
  });
  test('zwei gleichnamige Gäste und eine Antwort: keiner wird geraten', () => {
    const out = matchGuestList([G('Ali Yılmaz', placeholderEmail('Ali Yılmaz', 1), { id: 1 }), G('Ali Yılmaz', placeholderEmail('Ali Yılmaz', 2), { id: 2 })], [R('Ali Yılmaz', 'ali@example.test')]);
    expect(out.guests.map((g) => g.status)).toEqual(['pending', 'pending']);
    expect(out.guests[0].hint).toEqual(['Ali Yılmaz']);
  });
  test('jede Person wird nur einmal vergeben; exakte Treffer gehen vor', () => {
    const res = byName(matchGuestList([G('Anna Müller'), G('Anna Maria Müller')], [R('Anna Maria Müller', 'a@example.test')]));
    expect(res['Anna Maria Müller']).toMatchObject({ status: 'confirmed', via: 'name' });
    expect(res['Anna Müller'].status).toBe('pending');
  });
  test('ein Eintrag für ein Paar deckt beide Personen der Antwort ab', () => {
    const out = matchGuestList([G('Anna & Ben Müller')], [R('Anna Müller', 'a@example.test', true, [{ name: 'Anna Müller' }, { name: 'Ben Müller' }])]);
    expect(out.guests[0]).toMatchObject({ status: 'confirmed', via: 'name-likely' });
    expect(out.unlisted).toEqual([]);
  });
  test('Gast mit E-Mail, der mit anderer Adresse geantwortet hat, wird über den Namen gefunden', () => {
    const res = byName(matchGuestList([G('Lena Koch', 'lena@firma.test')], [R('Lena Koch', 'lena.privat@example.test')]));
    expect(res['Lena Koch']).toMatchObject({ status: 'confirmed', via: 'name' });
  });
  test('Zusagen ohne Eintrag werden gemeldet; Antworten als Text-JSON werden gelesen', () => {
    const out = matchGuestList([G('Olgu Durmaz')], [R('Olgu Durmaz', 'o@example.test'), { id: 'x', name: 'Unbekannt Gast', email: 'u@example.test', attending: true, guests: JSON.stringify([{ name: 'Unbekannt Gast' }, { name: 'Plus Eins' }]) }]);
    expect(out.unlisted.map((p) => p.name).sort()).toEqual(['Plus Eins', 'Unbekannt Gast']);
    expect(rsvpPersons([{ name: 'A B', guests: 'kaputt' }])).toHaveLength(1);
  });
  test('leere Listen und fehlende Namen bringen nichts zum Absturz', () => {
    expect(matchGuestList([], [])).toEqual({ guests: [], unlisted: [] });
    expect(matchGuestList(null, null)).toEqual({ guests: [], unlisted: [] });
    expect(matchGuestList([{ id: 1, name: '', email: 'x@example.test' }], [{ id: 2, name: null, email: null, attending: true }]).guests[0].status).toBe('pending');
  });
});

describe('Platzhalter-Adresse', () => {
  test('ist stabil, eindeutig je Name und nie zustellbar', () => {
    expect(placeholderEmail('Ayşe Yılmaz')).toBe('ayse.yilmaz@ohne-email.invalid');
    expect(placeholderEmail('Ayşe Yılmaz', 2)).toBe('ayse.yilmaz.2@ohne-email.invalid');
    expect(placeholderEmail('!!!')).toBe('gast@ohne-email.invalid');
    expect(hasRealEmail('ayse.yilmaz@ohne-email.invalid')).toBe(false);
    expect(hasRealEmail('a@example.test')).toBe(true);
    expect(hasRealEmail('')).toBe(false); expect(hasRealEmail(null)).toBe(false);
  });
});
