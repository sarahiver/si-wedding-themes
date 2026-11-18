import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LegalLinks, { LEGAL_LABELS } from '../LegalLinks';

const html = (props) => renderToStaticMarkup(<LegalLinks {...props} />);

describe('LegalLinks', () => {
  test('verlinkt Datenschutz und Impressum, öffnet in neuem Tab', () => {
    const out = html({});
    expect(out).toMatch(/<a href="\/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz<\/a>/);
    expect(out).toMatch(/<a href="\/impressum" target="_blank" rel="noopener noreferrer">Impressum<\/a>/);
  });
  test('Beschriftung in den vier Sprachen der Vorseiten, unbekannte Sprache fällt auf Deutsch zurück', () => {
    for (const lang of ['de', 'en', 'fr', 'tr']) { const out = html({ lang }); expect(out).toContain(`>${LEGAL_LABELS[lang].privacy}<`); expect(out).toContain(`>${LEGAL_LABELS[lang].imprint}<`); }
    expect(html({ lang: 'xx' })).toContain('>Datenschutz<');
  });
  test('Farbe und Schrift der Seite werden übernommen; das Trennzeichen ist für Vorleseprogramme verborgen', () => {
    const out = html({ color: 'rgb(1, 2, 3)', font: 'Testschrift' });
    expect(out).toContain('color:rgb(1, 2, 3)'); expect(out).toContain('font-family:Testschrift');
    expect(out).toMatch(/<span aria-hidden="true"> · <\/span>/);
  });
});
