// src/themes/cassis/ContactWitnesses.js – Trauzeug:innen als ruhige Liste
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { useWedding } from '../../context/WeddingContext';
import { C, SERIF, Section, Inner, Title, DESK } from './shared';
import { follows } from './helpers';
import { FaqBlock } from './FAQ';

const List = styled.ul`list-style: none; margin: 0; padding: 0;`;
const Person = styled.li`
  display: grid; gap: 1.25rem; align-items: center; padding: 1.25rem 0; border-top: 1px solid ${C.haze};
  grid-template-columns: ${(p) => (p.$photo ? '4.5rem 1fr' : '1fr')};
  img { width: 4.5rem; height: 4.5rem; border-radius: 50%; object-fit: cover; }
`;
const Name = styled.p`margin: 0; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.625rem, 2.2vw, 2.25rem); line-height: 1.15; overflow-wrap: anywhere;`;
const Role = styled.p`margin: 0.15rem 0 0; color: ${C.inkSoft};`;
const Links = styled.p`
  margin: 0.25rem 0 0; display: flex; flex-wrap: wrap; gap: 0 1.5rem;
  a { color: ${C.ink}; min-height: 2.75rem; display: inline-flex; align-items: center; text-decoration-thickness: 1px; text-underline-offset: 0.25em; text-decoration-color: ${C.haze}; transition: text-decoration-color 0.2s ease; }
  a:hover { text-decoration-color: ${C.ink}; }
  a:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;
const Block = styled.section`scroll-margin-top: 5.5rem; min-width: 0; margin-bottom: ${(p) => (p.$joined ? '4rem' : '0')}; h2 { margin-bottom: 2.5rem; } ${DESK} { grid-column: 1 / 5; margin-bottom: 0; }`;
const digits = (s) => String(s || '').replace(/[^\d+]/g, '');

function ContactWitnesses() {
  const { project, isComponentActive } = useWedding();
  const { t } = useLanguage();
  const w = useLocalizedContent('witnesses');
  const persons = (Array.isArray(w.persons) ? w.persons : []).filter((p) => p && p.name);
  if (!persons.length) return null;
  // Stehen die Fragen direkt dahinter, teilen sich beide diese Seite
  const withFaq = isComponentActive('faq') && follows(project, isComponentActive, 'witnesses', 'faq');
  return (
    <Section $tone="pearl">
      <Inner>
        <Block id="witnesses" $joined={withFaq}>
          <Title $small>{w.title || t(STRINGS, 'witnesses')}</Title>
          <List>
            {persons.map((p, i) => (
              <Person key={i} $photo={!!p.image}>
                {p.image && <img src={p.image} alt="" loading="lazy" />}
                <div>
                  <Name>{p.name}</Name>
                  {p.role && <Role>{p.role}</Role>}
                  {(p.phone || p.whatsapp || p.email) && (
                    <Links>
                      {p.phone && <a href={`tel:${digits(p.phone)}`}>{t(STRINGS, 'call')}</a>}
                      {p.whatsapp && <a href={`https://wa.me/${digits(p.whatsapp).replace('+', '')}`} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'whatsapp')}</a>}
                      {p.email && <a href={`mailto:${p.email}`}>{t(STRINGS, 'mail')}</a>}
                    </Links>
                  )}
                </div>
              </Person>
            ))}
          </List>
        </Block>
        {withFaq && <FaqBlock />}
      </Inner>
    </Section>
  );
}
export default ContactWitnesses;
