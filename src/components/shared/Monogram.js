// src/components/shared/Monogram.js
// Optionales Monogramm anstelle der generierten Initialen.
//
// Die URL liegt pro Projekt in custom_styles.monogram_url und wird im
// SuperAdmin gesetzt (neben der Highlight-Farbe). Ohne URL rendert die
// Komponente nichts — der Aufrufer zeigt dann die Initialen.
//
// Warum CSS-Maske statt <img>: Ein eingebettetes SVG lässt sich nicht
// einfärben. Als Maske wird die Grafik zur Schablone, die Farbe kommt aus
// background-color — also aus currentColor und damit aus der im Dashboard
// gewählten Akzentfarbe. Eine Farbquelle, kein zweiter Wert.
import React from 'react';
import styled from 'styled-components';

const MaskedMark = styled.span`
  display: inline-block;
  width: ${p => p.$size};
  height: ${p => p.$size};
  background-color: currentColor;
  -webkit-mask-image: url(${p => p.$src});
  mask-image: url(${p => p.$src});
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
  vertical-align: middle;
`;

// Liest die URL aus dem Projekt. Akzeptiert project ODER eine direkte src.
export const monogramUrl = (project) =>
  project?.custom_styles?.monogram_url || '';

const Monogram = ({ project, src, size = '2em', title = 'Monogramm' }) => {
  const url = src || monogramUrl(project);
  if (!url) return null;
  return <MaskedMark $src={url} $size={size} role="img" aria-label={title} />;
};

export default Monogram;
