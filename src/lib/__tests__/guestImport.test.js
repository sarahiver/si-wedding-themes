import { parseCsv, rowsToGuests, splitCsvLine, detectColumns } from '../guestImport';

test('nur Namen: alle Gäste werden übernommen und bekommen eine Platzhalter-Adresse', () => {
  const r = parseCsv('Name\nOlgu Durmaz\nEmre Gücer\n\nSelin Kaya\n');
  expect(r.guests.map((g) => g.name)).toEqual(['Olgu Durmaz', 'Emre Gücer', 'Selin Kaya']);
  expect(r.withoutEmail).toBe(3);
  expect(r.guests[1].email).toBe('emre.gucer@ohne-email.invalid');
});
test('gemischt: echte Adressen bleiben, leere und ungültige werden zu Platzhaltern', () => {
  const r = parseCsv('﻿Name;Email;Gruppe\nAnna Müller;ANNA@Example.test;Familie\nMax Schmidt;;Freunde\nLisa Weber;keine;Kollegen');
  expect(r.guests).toEqual([
    { name: 'Anna Müller', email: 'anna@example.test', group_name: 'Familie' },
    { name: 'Max Schmidt', email: 'max.schmidt@ohne-email.invalid', group_name: 'Freunde' },
    { name: 'Lisa Weber', email: 'lisa.weber@ohne-email.invalid', group_name: 'Kollegen' },
  ]);
  expect(r.withoutEmail).toBe(2);
});
test('Vorname und Nachname in getrennten Spalten; Komma als Trennzeichen; Anführungszeichen', () => {
  const r = parseCsv('Vorname,Nachname,E-Mail\n"Ayşe","Yılmaz, geb. Kaya",\nCan,Demir,can@example.test');
  expect(r.guests.map((g) => g.name)).toEqual(['Ayşe Yılmaz, geb. Kaya', 'Can Demir']);
  expect(splitCsvLine('a;"b;c";"d ""e"""', ';')).toEqual(['a', 'b;c', 'd "e"']);
});
test('gleichnamige Gäste ohne E-Mail bleiben beide erhalten; doppelte Adressen nur einmal', () => {
  const r = parseCsv('Name;Email\nAli Yılmaz;\nAli Yılmaz;\nEva Roth;eva@example.test\nEva R.;eva@example.test');
  expect(r.guests.map((g) => g.email)).toEqual(['ali.yilmaz@ohne-email.invalid', 'ali.yilmaz.2@ohne-email.invalid', 'eva@example.test']);
  expect(r.skipped).toBe(1);
});
test('ohne Namensspalte: ungültig; leere Datei: keine Gäste', () => {
  expect(parseCsv('Email;Gruppe\na@example.test;x')).toBeNull();
  expect(detectColumns(['E-Mail'])).toBeNull();
  expect(parseCsv('').guests).toEqual([]);
  expect(parseCsv('Name\n').guests).toEqual([]);
});
test('Zeilen aus Excel (Zahlen und leere Zellen) werden verarbeitet', () => {
  const r = rowsToGuests([['Name', 'Email', 'Gruppe'], ['Anna Müller', '', 12], [null, null, null], ['  ', 'x@example.test', '']]);
  expect(r.guests).toEqual([{ name: 'Anna Müller', email: 'anna.muller@ohne-email.invalid', group_name: '12' }]);
  expect(r.skipped).toBe(1);
});
