// src/themes/cassis/Dresscode.js – Dresscode als Mittelseite: Überschrift, ein kursiver Satz,
// die Farben als Stoffmuster, darunter die Hinweise in zwei Spalten. Alles auf der Mittelachse.
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { OWN_TITLE } from './helpers';
import { C, SERIF, HEADING, DESK, Section, Inner, Full, Title } from './shared';

const Page = styled.div`text-align: center; max-width: 62rem; margin: 0 auto;`;
const Code = styled.p`margin: 1.25rem 0 0; font-family: ${HEADING}; font-weight: 400; font-size: clamp(1.75rem, 3.2vw, 3.25rem); line-height: 1.25; overflow-wrap: anywhere;`;
const Copy = styled.p`margin: 2rem auto 0; max-width: 34em; white-space: pre-line; overflow-wrap: anywhere;`;
// Die Farben sind Anregung, keine Auswahl: hohe Muster wie Stoffproben, darunter der Name
const Swatches = styled.ul`
  list-style: none; margin: clamp(2.5rem, 5vw, 4.5rem) 0 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 1.75rem clamp(0.75rem, 1.6vw, 1.5rem);
  /* Handy: drei Muster je Reihe; ab Tablet stehen bis zu fünf nebeneinander */
  li { width: min(26vw, 7.5rem); }
  ${DESK} { li { width: clamp(5rem, 11vw, 7.5rem); } }
  i { display: block; aspect-ratio: 3 / 4; box-shadow: inset 0 0 0 1px ${C.line}; }
  span { display: block; margin-top: 0.75rem; font-size: 0.9375rem; line-height: 1.35; color: ${C.inkSoft}; overflow-wrap: anywhere; hyphens: auto; }
`;
const Lists = styled.div`
  margin: clamp(2.5rem, 5vw, 4.5rem) auto 0; max-width: 46rem; display: grid; gap: 2.5rem clamp(1.5rem, 4vw, 4rem);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
`;
const Group = styled.div`
  border-top: 1px solid ${C.line}; padding-top: 1.5rem;
  h3 { margin: 0 0 0.9rem; font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: clamp(1.5rem, 2vw, 2rem); line-height: 1.2; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { padding: 0.3rem 0; overflow-wrap: anywhere; }
  ${DESK} { padding-top: 1.75rem; }
`;
const HEX = /^#[0-9a-f]{3,8}$/i;
const clean = (list) => (Array.isArray(list) ? list : []).map((x) => (typeof x === 'string' ? x : (x && (x.text || x.title)) || '')).map((x) => String(x).trim()).filter(Boolean);

function Dresscode() {
  const { t } = useLanguage();
  const d = useLocalizedContent('dresscode', OWN_TITLE);
  const colors = (Array.isArray(d.colors) ? d.colors : []).map((c) => (typeof c === 'string' ? { hex: c, name: '' } : c)).filter((c) => c && HEX.test(String(c.hex || '').trim()));
  const dos = clean(d.dos); const donts = clean(d.donts);
  if (!d.code && !d.description && !colors.length && !dos.length && !donts.length) return null;
  return (
    <Section id="dresscode" $tone="shell">
      <Inner>
        <Full>
          <Page>
            <Title>{d.title || t(STRINGS, 'dresscodeTitle')}</Title>
            {d.code && <Code>{d.code}</Code>}
            {d.description && <Copy>{d.description}</Copy>}
            {colors.length > 0 && (
              <Swatches>
                {colors.map((c, i) => (<li key={i}><i style={{ background: String(c.hex).trim() }} aria-hidden="true" />{c.name && <span>{c.name}</span>}</li>))}
              </Swatches>
            )}
            {(dos.length > 0 || donts.length > 0) && (
              <Lists>
                {dos.length > 0 && <Group><h3>{t(STRINGS, 'dos')}</h3><ul>{dos.map((x, i) => <li key={i}>{x}</li>)}</ul></Group>}
                {donts.length > 0 && <Group><h3>{t(STRINGS, 'donts')}</h3><ul>{donts.map((x, i) => <li key={i}>{x}</li>)}</ul></Group>}
              </Lists>
            )}
          </Page>
        </Full>
      </Inner>
    </Section>
  );
}
export default Dresscode;
