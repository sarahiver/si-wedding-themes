// src/themes/cassis/Dresscode.js – Dresscode: ein Wort, ein Satz, bei Bedarf Farben und Hinweise
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, SERIF, Section, Inner, Aside, Body, Title, Text, DESK } from './shared';

const Code = styled.p`margin: 0 0 1.5rem; font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: clamp(1.875rem, 3.2vw, 3.25rem); line-height: 1.1; overflow-wrap: anywhere;`;
// Die Farben sind Inhalt, kein Schmuck: jede steht mit ihrem Namen da
const Colors = styled.ul`
  list-style: none; margin: 2rem 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 1rem 2rem;
  li { display: flex; align-items: center; gap: 0.75rem; }
  i { flex: none; width: 2.25rem; height: 2.25rem; border-radius: 50%; border: 1px solid ${C.line}; }
`;
const Lists = styled.div`margin-top: 2.5rem; display: grid; gap: 2rem ${'clamp(1.5rem, 4vw, 4rem)'}; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));`;
const Group = styled.div`
  h3 { margin: 0 0 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid ${C.haze}; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.375rem, 1.8vw, 1.875rem); line-height: 1.2; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { padding: 0.35rem 0; overflow-wrap: anywhere; }
  ${DESK} { h3 { margin-bottom: 1rem; } }
`;
const HEX = /^#[0-9a-f]{3,8}$/i;
const clean = (list) => (Array.isArray(list) ? list : []).map((x) => (typeof x === 'string' ? x : (x && (x.text || x.title)) || '')).map((x) => String(x).trim()).filter(Boolean);

function Dresscode() {
  const { t } = useLanguage();
  const d = useLocalizedContent('dresscode');
  const colors = (Array.isArray(d.colors) ? d.colors : []).map((c) => (typeof c === 'string' ? { hex: c, name: '' } : c)).filter((c) => c && HEX.test(String(c.hex || '').trim()));
  const dos = clean(d.dos); const donts = clean(d.donts);
  if (!d.code && !d.description && !colors.length && !dos.length && !donts.length) return null;
  return (
    <Section id="dresscode" $tone="shell">
      <Inner>
        <Aside><Title $small>{d.title || t(STRINGS, 'dresscodeTitle')}</Title></Aside>
        <Body>
          {d.code && <Code>{d.code}</Code>}
          {d.description && <Text>{d.description}</Text>}
          {colors.length > 0 && (
            <Colors>
              {colors.map((c, i) => (<li key={i}><i style={{ background: String(c.hex).trim() }} aria-hidden="true" />{c.name && <span>{c.name}</span>}</li>))}
            </Colors>
          )}
          {(dos.length > 0 || donts.length > 0) && (
            <Lists>
              {dos.length > 0 && <Group><h3>{t(STRINGS, 'dos')}</h3><ul>{dos.map((x, i) => <li key={i}>{x}</li>)}</ul></Group>}
              {donts.length > 0 && <Group><h3>{t(STRINGS, 'donts')}</h3><ul>{donts.map((x, i) => <li key={i}>{x}</li>)}</ul></Group>}
            </Lists>
          )}
        </Body>
      </Inner>
    </Section>
  );
}
export default Dresscode;
