// src/themes/cassis/Directions.js – Anfahrt mit Adresse, Route und der Illustration des Orts
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, Section, Inner, Aside, Body, Title, Text, Button } from './shared';
import { mapsLink } from './helpers';

const Place = styled.p`margin: 0; font-weight: 300; font-size: 1.375rem; line-height: 1.3;`;
const Address = styled.address`margin: 0.4rem 0 1.5rem; font-style: normal; white-space: pre-line; color: ${C.inkSoft};`;
const Options = styled.dl`margin: 2rem 0 0; display: grid; gap: 1.5rem;`;
const Term = styled.dt`font-weight: 300; font-size: 1.1875rem; line-height: 1.3;`;
const Desc = styled.dd`margin: 0.3rem 0 0; white-space: pre-line; overflow-wrap: anywhere; color: ${C.inkSoft};`;
const Actions = styled.div`margin-top: 0.5rem;`;
// Die Illustration bleibt klein und zurückhaltend: ein Motiv, einmal auf der Seite
// Auf dem Handy steht sie nach dem Text, ab Tablet unter der Überschrift.
const Illustration = styled.img`
  display: block; width: 100%; max-width: 15rem; height: auto; margin: 0.5rem 0 0; opacity: 0.6;
  @media (min-width: 900px) { grid-column: 1; grid-row: 2; max-width: 17rem; margin-top: 1rem; }
`;
const Content = styled(Body)`@media (min-width: 900px) { grid-column: 2; grid-row: 1 / span 2; }`;

function Directions() {
  const { project } = useWedding();
  const { t } = useLanguage();
  const d = useLocalizedContent('directions');
  const items = (Array.isArray(d.items) ? d.items : (Array.isArray(d.options) ? d.options : [])).filter((x) => x && (x.title || x.description));
  const url = mapsLink(d, project?.location);
  if (!d.description && !d.address && !items.length) return null;
  return (
    <Section id="directions" $tone="shell">
      <Inner>
        <Aside>
          <Title>{d.title || t(STRINGS, 'directions')}</Title>
        </Aside>
        <Content>
          {d.address && (<>
            {project?.location && <Place>{project.location}</Place>}
            <Address>{d.address}</Address>
          </>)}
          {d.description && <Text>{d.description}</Text>}
          {url && <Actions><Button href={url} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'route')}</Button></Actions>}
          {items.length > 0 && (
            <Options>
              {items.map((x, i) => (<div key={i}><Term>{x.title}</Term><Desc>{x.description}</Desc></div>))}
            </Options>
          )}
        </Content>
        {d.image && <Illustration src={d.image} alt="" loading="lazy" />}
      </Inner>
    </Section>
  );
}
export default Directions;
