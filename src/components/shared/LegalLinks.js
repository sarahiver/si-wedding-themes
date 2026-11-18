// src/components/shared/LegalLinks.js
// Unauffällige Links zu Datenschutzerklärung und Impressum für Seiten ohne eigene Fußzeile
// (Passwort-Abfrage, „Hier entsteht …", Save the Date, Danke-Seite).
// Schrift und Farbe kommen von der jeweiligen Seite; die Links öffnen in einem neuen Tab,
// damit eine begonnene Eingabe nicht verloren geht.
import React from 'react';
import styled from 'styled-components';

export const LEGAL_LABELS = {
  de: { privacy: 'Datenschutz', imprint: 'Impressum' },
  en: { privacy: 'Privacy', imprint: 'Legal notice' },
  fr: { privacy: 'Confidentialité', imprint: 'Mentions légales' },
  tr: { privacy: 'Gizlilik', imprint: 'Künye' },
};

const Wrap = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  letter-spacing: 0.04em;
  text-align: center;
  ${(p) => (p.$pinned ? 'position: absolute; left: 0; right: 0; bottom: 0.25rem; z-index: 20;' : '')}
  /* helle Schrift über Bildern: leichter Schatten hält sie lesbar */
  ${(p) => (p.$shadow ? 'text-shadow: 0 1px 3px rgba(0,0,0,0.85);' : '')}

  a {
    display: inline-flex;
    align-items: center;
    /* Trefferfläche von mindestens 44 px Höhe, unabhängig von der Schrift */
    min-height: 44px;
    padding: 0 0.5rem;
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }
  a:hover { text-decoration-thickness: 2px; }
  a:focus-visible { outline: 2px solid currentColor; outline-offset: -4px; }
`;

/**
 * @param {string} lang    Sprache der Beschriftung (de, en, fr, tr) – Standard: Deutsch
 * @param {string} color   Schriftfarbe; ohne Angabe die der Umgebung
 * @param {string} font    Schriftfamilie; ohne Angabe die der Umgebung
 * @param {boolean} pinned am unteren Rand der (relativ positionierten) Seite halten
 * @param {boolean} shadow Schatten für helle Schrift über Bildern
 */
export default function LegalLinks({ lang = 'de', color, font, pinned = false, shadow = false, style, className }) {
  const t = LEGAL_LABELS[lang] || LEGAL_LABELS.de;
  return (
    <Wrap className={className} $pinned={pinned} $shadow={shadow} style={{ ...(color ? { color } : {}), ...(font ? { fontFamily: font } : {}), ...style }} data-legal-links>
      <a href="/datenschutz" target="_blank" rel="noopener noreferrer">{t.privacy}</a>
      <span aria-hidden="true"> · </span>
      <a href="/impressum" target="_blank" rel="noopener noreferrer">{t.imprint}</a>
    </Wrap>
  );
}
