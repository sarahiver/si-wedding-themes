// src/components/shared/HealthConsent.js
// Einwilligung für Allergie-Angaben im RSVP-Formular.
// Erscheint nur, wenn jemand Allergien oder Unverträglichkeiten einträgt (useRSVP: healthConsentNeeded).
// Die Logik ist dieselbe wie bei Cassis; jedes Design gibt hier nur Schrift und Farben vor,
// damit sich die Zeile in sein Formular einfügt.
import React, { useId } from 'react';
import styled from 'styled-components';

// Wortlaut wie im Cassis-Formular
export const HEALTH_CONSENT_TEXT = {
  de: {
    label: 'Ich bin einverstanden, dass die hier eingetragenen Angaben zu Allergien und Ernährung für die Planung des Hochzeitsessens verarbeitet werden.',
    error: 'Bitte bestätigt die Einwilligung zu den Allergie-Angaben oder entfernt diese Angaben.',
  },
  en: {
    label: 'I agree that the allergy and diet details entered here are processed to plan the wedding meal.',
    error: 'Please confirm the consent for the allergy details, or remove them.',
  },
};

const MARK = (stroke) => `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='${encodeURIComponent(stroke)}' stroke-width='1.8'%3E%3Cpath d='M1.5 6.5 L4.8 9.6 L10.5 2.4'/%3E%3C/svg%3E")`;

const Wrap = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  box-sizing: border-box;
  min-height: 2.75rem;
  margin: ${(p) => p.$t.margin || '1rem 0 0'};
  padding: 0.35rem 0;
  font-family: ${(p) => p.$t.font || 'inherit'};
  font-size: ${(p) => p.$t.size || '0.85rem'};
  font-weight: ${(p) => p.$t.weight || 400};
  line-height: 1.5;
  letter-spacing: normal;
  text-transform: none;
  text-align: left;
  color: ${(p) => p.$t.color || 'inherit'};
  cursor: pointer;

  input {
    flex: none;
    appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    width: 1.25rem;
    height: 1.25rem;
    margin: 0.1rem 0 0;
    padding: 0;
    border: ${(p) => p.$t.borderWidth || '1px'} solid ${(p) => p.$t.border || 'currentColor'};
    border-radius: ${(p) => p.$t.radius || '0'};
    background: transparent no-repeat center / 0.75rem;
    cursor: pointer;
  }
  input:checked {
    background-color: ${(p) => p.$t.accent || 'currentColor'};
    border-color: ${(p) => p.$t.accent || 'currentColor'};
    background-image: ${(p) => MARK(p.$t.mark || '#ffffff')};
  }
  input:focus-visible { outline: 2px solid ${(p) => p.$t.focus || p.$t.accent || 'currentColor'}; outline-offset: 3px; }
  input[aria-invalid='true'] { outline: 2px solid ${(p) => p.$t.error || '#c44'}; outline-offset: 2px; }
`;

/**
 * @param {boolean} checked   aktueller Wert (formData.healthConsent === true)
 * @param {function} onChange erhält true/false
 * @param {boolean} invalid   Absenden ohne Einwilligung versucht
 * @param {object} look       Aussehen des Designs: font, size, weight, color, border, borderWidth, radius,
 *                            accent (Fläche des angehakten Kästchens), mark (Farbe des Hakens), focus, error, margin
 * @param {string} lang       'de' (Standard) oder 'en'
 */
export default function HealthConsent({ checked, onChange, invalid = false, look = {}, lang = 'de', style, className }) {
  const id = useId();
  const t = HEALTH_CONSENT_TEXT[lang] || HEALTH_CONSENT_TEXT.de;
  return (
    <Wrap $t={look} htmlFor={id} style={style} className={className} data-health-consent>
      <input id={id} type="checkbox" checked={checked === true} onChange={(e) => onChange(e.target.checked)} aria-invalid={invalid ? 'true' : undefined} />
      <span>{t.label}</span>
    </Wrap>
  );
}
