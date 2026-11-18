// src/lib/guestImport.js
// Gästeliste aus CSV oder Excel einlesen. Pflicht ist nur der Name; E-Mail und Gruppe sind freiwillig.
// Gäste ohne E-Mail-Adresse bekommen eine Platzhalter-Adresse (siehe guestMatch.js) und werden
// über den Namen mit den Antworten abgeglichen.
import { placeholderEmail, normalizeName } from './guestMatch';

const COLS = {
  name: ['name', 'gast', 'gästename', 'gastname', 'vollständiger name', 'full name', 'fullname', 'isim', 'ad soyad', 'nom complet'],
  first: ['vorname', 'first name', 'firstname', 'prénom', 'prenom', 'ad'],
  last: ['nachname', 'familienname', 'last name', 'lastname', 'surname', 'nom', 'soyad'],
  email: ['email', 'e-mail', 'mail', 'emailadresse', 'e-mail-adresse', 'e-posta', 'eposta', 'courriel'],
  group: ['gruppe', 'group', 'kategorie', 'kreis', 'grup', 'groupe'],
};
const clean = (h) => String(h ?? '').replace(/^﻿/, '').trim().toLowerCase().replace(/['"]/g, '');
const find = (headers, kind) => headers.findIndex((h) => COLS[kind].includes(h));

/** Spalten anhand der Kopfzeile bestimmen. null, wenn keine Namensspalte vorhanden ist. */
export function detectColumns(headerRow) {
  const headers = headerRow.map(clean);
  const c = { name: find(headers, 'name'), first: find(headers, 'first'), last: find(headers, 'last'), email: find(headers, 'email'), group: find(headers, 'group') };
  if (c.name === -1 && c.first === -1 && c.last === -1) return null;
  return c;
}

/**
 * Zeilen (Arrays von Zellen, erste Zeile = Kopfzeile) in Gäste umwandeln.
 * Zurück: null bei fehlender Namensspalte, sonst { guests, withoutEmail, skipped }.
 */
export function rowsToGuests(rows) {
  if (!rows || !rows.length) return { guests: [], withoutEmail: 0, skipped: 0 };
  const c = detectColumns(rows[0]);
  if (!c) return null;
  const cell = (row, i) => (i === -1 ? '' : String(row[i] ?? '').trim());
  const guests = []; const seenMail = new Set(); const seenName = {}; let withoutEmail = 0; let skipped = 0;
  for (const row of rows.slice(1)) {
    if (!row || row.every((x) => String(x ?? '').trim() === '')) continue;
    const name = (cell(row, c.name) || [cell(row, c.first), cell(row, c.last)].filter(Boolean).join(' ')).replace(/\s+/g, ' ').trim();
    if (!name || !normalizeName(name)) { skipped++; continue; }
    let email = cell(row, c.email).toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = '';
    if (email) { if (seenMail.has(email)) { skipped++; continue; } seenMail.add(email); }
    else { const key = normalizeName(name); seenName[key] = (seenName[key] || 0) + 1; email = placeholderEmail(name, seenName[key]); withoutEmail++; }
    guests.push({ name, email, group_name: cell(row, c.group) });
  }
  return { guests, withoutEmail, skipped };
}

/** Eine CSV-Zeile zerlegen; Anführungszeichen dürfen das Trennzeichen enthalten. */
export function splitCsvLine(line, sep) {
  const out = []; let cur = ''; let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') quoted = false; else cur += ch; }
    else if (ch === '"') quoted = true;
    else if (ch === sep) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

export function parseCsv(text) {
  const lines = String(text || '').replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim() !== '');
  if (!lines.length) return { guests: [], withoutEmail: 0, skipped: 0 };
  const first = lines[0];
  const sep = first.includes(';') ? ';' : first.includes('\t') ? '\t' : ',';
  return rowsToGuests(lines.map((l) => splitCsvLine(l, sep)));
}

export async function parseXlsx(buffer) {
  try {
    const XLSX = await import('xlsx');
    const wb = XLSX.read(buffer, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    return rowsToGuests(XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }));
  } catch {
    return null;
  }
}
