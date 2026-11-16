// core/sections/RsvpExtrasPanel.js
// Zusatzübersicht für Projekte mit RSVP-Regeln oder mehreren Sprachen:
// Kinder mit Alter (für die Betreuung) und Sprache je Antwort.
// Für alle anderen Projekte wird nichts angezeigt – die bestehende Tabelle
// und ihr Export bleiben unverändert.
import React, { useMemo } from 'react';
import { useAdmin } from '../AdminContext';

const LANG = { en: 'Englisch', tr: 'Türkisch', de: 'Deutsch', fr: 'Französisch' };

export function parseGuests(r) {
  if (Array.isArray(r?.guests)) return r.guests;
  if (typeof r?.guests === 'string') { try { const g = JSON.parse(r.guests); return Array.isArray(g) ? g : []; } catch { return []; } }
  return [];
}

/** Kennzahlen aus den Antworten. Zählt nur Zusagen. */
export function summarizeExtras(rsvpData) {
  const children = []; const byLang = {}; let persons = 0;
  (rsvpData || []).forEach((r) => {
    if (r.language) byLang[r.language] = (byLang[r.language] || 0) + 1;
    if (!r.attending) return;
    persons += r.persons || 1;
    parseGuests(r).forEach((g) => { if (g && g.is_child) children.push({ family: r.name, name: g.name || '', age: Number.isInteger(g.age) ? g.age : null }); });
  });
  children.sort((a, b) => (a.age ?? 99) - (b.age ?? 99));
  return { children, byLang, persons };
}

// CSV-Feld sicher einfassen: Anführungszeichen verdoppeln, Formelzeichen entschärfen
export function csvCell(v) {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function buildExtrasCsv(rsvpData) {
  const rows = [['Anmeldung', 'E-Mail', 'Status', 'Personen gesamt', 'Person', 'Kind', 'Alter', 'Sprache']];
  (rsvpData || []).forEach((r) => {
    const guests = parseGuests(r);
    const list = guests.length ? guests : [{ name: r.name }];
    list.forEach((g, i) => rows.push([
      r.name, r.email, r.attending ? 'Zusage' : 'Absage', i === 0 ? (r.persons || 1) : '',
      g.name || (i === 0 ? r.name : ''), g.is_child ? 'ja' : 'nein', Number.isInteger(g.age) ? g.age : '', LANG[r.language] || r.language || '',
    ]));
  });
  return '﻿' + rows.map((row) => row.map(csvCell).join(';')).join('\n');
}

function RsvpExtrasPanel({ components: C }) {
  const { rsvpData, project } = useAdmin();
  const features = project?.features || {};
  const hasRules = !!features.rsvp;
  const hasLanguages = Array.isArray(features.i18n?.languages) && features.i18n.languages.length > 0;
  const sum = useMemo(() => summarizeExtras(rsvpData), [rsvpData]);
  if (!hasRules && !hasLanguages) return null;

  const download = () => {
    const blob = new Blob([buildExtrasCsv(rsvpData)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `RSVP_Kinder_Sprachen_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div data-testid="rsvp-extras">
    <C.Panel style={{ marginBottom: '1.5rem' }}>
      <C.PanelHeader><C.PanelTitle>Kinder und Sprachen</C.PanelTitle></C.PanelHeader>
      <C.PanelContent>
        {hasRules && (
          <>
            <p style={{ margin: '0 0 0.5rem' }}>
              <strong>{sum.children.length}</strong> {sum.children.length === 1 ? 'Kind' : 'Kinder'} bei den Zusagen
              {features.rsvp.max_persons ? ` · höchstens ${features.rsvp.max_persons} Personen pro Anmeldung` : ''}
            </p>
            {sum.children.length > 0 && (
              <C.TableWrapper style={{ marginBottom: '1rem' }}>
                <C.Table>
                  <thead><tr><C.Th>Alter</C.Th><C.Th>Kind</C.Th><C.Th>Anmeldung</C.Th></tr></thead>
                  <tbody>
                    {sum.children.map((k, i) => (
                      <tr key={i}><C.Td>{k.age === null ? 'ohne Angabe' : `${k.age} ${k.age === 1 ? 'Jahr' : 'Jahre'}`}</C.Td><C.Td>{k.name || '–'}</C.Td><C.Td>{k.family}</C.Td></tr>
                    ))}
                  </tbody>
                </C.Table>
              </C.TableWrapper>
            )}
          </>
        )}
        {hasLanguages && (
          <p style={{ margin: '0 0 1rem' }}>
            Sprache der Antworten:{' '}
            {Object.keys(sum.byLang).length === 0 ? 'noch keine Antworten'
              : Object.entries(sum.byLang).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${LANG[l] || l} ${n}`).join(' · ')}
          </p>
        )}
        <C.Button onClick={download}>Kinder und Sprachen exportieren (CSV)</C.Button>
      </C.PanelContent>
    </C.Panel>
    </div>
  );
}

export default RsvpExtrasPanel;
