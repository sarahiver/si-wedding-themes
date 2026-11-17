// src/themes/cassis/ContactWitnesses.js – Ansprechpersonen: der Name groß, Rolle und Kontakt darunter
import React from 'react';
import styled, { css } from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { useWedding } from '../../context/WeddingContext';
import { C, SERIF, G, DESK, italic, textLink, Section, Inner, Title } from './shared';
import { follows, closingTone } from './helpers';
import { FaqBlock, WIDE } from './FAQ';

const List = styled.ul`
  list-style: none; margin: 0; padding: 0;
  /* Wo Platz ist, verteilen sich die Personen auf Spalten – neben den Fragen stehen sie untereinander */
  display: grid; column-gap: ${G}; grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  ${(p) => !p.$columns && css`${WIDE} { display: block; }`}
`;
const Person = styled.li`
  display: grid; gap: 1.25rem; align-items: start; padding: clamp(1.5rem, 2.2vw, 2.25rem) 0; border-top: 1px solid ${(p) => p.$line};
  grid-template-columns: ${(p) => (p.$photo ? '4.5rem minmax(0, 1fr)' : 'minmax(0, 1fr)')};
  img { width: 4.5rem; height: 4.5rem; border-radius: 50%; object-fit: cover; }
`;
const Name = styled.p`margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(2rem, 3vw, 3.125rem); line-height: 1.05; letter-spacing: -0.005em; overflow-wrap: anywhere; hyphens: auto;`;
const Role = styled.p`margin: 0.5rem 0 0; ${italic} color: ${(p) => p.$soft}; overflow-wrap: anywhere;`;
const Links = styled.p`
  margin: 0.75rem 0 -0.5rem; display: flex; flex-wrap: wrap; gap: 0 1.75rem;
  a { ${textLink} font-variant-numeric: lining-nums; }
`;
// Neben den Fragen: linke Spalte. Allein: Überschrift links, Personen rechts.
const Block = styled.section`
  scroll-margin-top: 5.5rem; min-width: 0; margin-bottom: ${(p) => (p.$joined ? 'clamp(4rem, 9vw, 6rem)' : '0')};
  h2 { margin-bottom: 2.5rem; }
  ${DESK} { grid-column: 1 / -1; }
  ${WIDE} {
    margin-bottom: 0;
    ${(p) => (p.$joined ? css`grid-column: 1 / 6;` : css`grid-column: 1 / -1; display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: ${G}; align-items: start; h2 { grid-column: 1 / 6; margin-bottom: 0; } ul { grid-column: 6 / 13; }`)}
  }
`;
const digits = (s) => String(s || '').replace(/[^\d+]/g, '');

function ContactWitnesses() {
  const { project, isComponentActive } = useWedding();
  const { t } = useLanguage();
  const w = useLocalizedContent('witnesses');
  const persons = (Array.isArray(w.persons) ? w.persons : []).filter((p) => p && p.name);
  if (!persons.length) return null;
  // Stehen die Fragen direkt dahinter, teilen sich beide diese Seite
  const withFaq = isComponentActive('faq') && follows(project, isComponentActive, 'witnesses', 'faq');
  const tone = closingTone(project, isComponentActive, 'witnesses');
  const mist = tone === 'mist';
  return (
    <Section $tone={tone}>
      <Inner>
        <Block id="witnesses" $joined={withFaq}>
          <Title $small>{w.title || t(STRINGS, 'witnesses')}</Title>
          <List $columns={!withFaq}>
            {persons.map((p, i) => (
              <Person key={i} $photo={!!p.image} $line={mist ? C.lineMist : C.line}>
                {p.image && <img src={p.image} alt="" loading="lazy" />}
                <div>
                  <Name>{p.name}</Name>
                  {p.role && <Role $soft={mist ? C.ink : C.inkSoft}>{p.role}</Role>}
                  {(p.phone || p.whatsapp || p.email) && (
                    <Links>
                      {p.phone && <a href={`tel:${digits(p.phone)}`} aria-label={`${t(STRINGS, 'call')}: ${p.phone}`}>{p.phone}</a>}
                      {p.whatsapp && <a href={`https://wa.me/${digits(p.whatsapp).replace('+', '')}`} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'whatsapp')}</a>}
                      {p.email && <a href={`mailto:${p.email}`} aria-label={`${t(STRINGS, 'mail')}: ${p.email}`}>{p.email}</a>}
                    </Links>
                  )}
                </div>
              </Person>
            ))}
          </List>
        </Block>
        {withFaq && <FaqBlock $joined $mist={mist} />}
      </Inner>
    </Section>
  );
}
export default ContactWitnesses;
