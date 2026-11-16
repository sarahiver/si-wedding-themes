// src/themes/cassis/ContactWitnesses.js – Trauzeug:innen als ruhige Liste
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, Section, Inner, Aside, Body, Title } from './shared';

const List = styled.ul`list-style: none; margin: 0; padding: 0; display: grid; gap: 2.25rem;`;
const Person = styled.li`
  display: grid; gap: 1.25rem; align-items: center;
  grid-template-columns: ${(p) => (p.$photo ? '4.5rem 1fr' : '1fr')};
  img { width: 4.5rem; height: 4.5rem; border-radius: 50%; object-fit: cover; }
`;
const Name = styled.p`margin: 0; font-weight: 300; font-size: 1.375rem; line-height: 1.3; overflow-wrap: anywhere;`;
const Role = styled.p`margin: 0.15rem 0 0; color: ${C.inkSoft};`;
const Links = styled.p`
  margin: 0.25rem 0 0; display: flex; flex-wrap: wrap; gap: 0 1.5rem;
  a { color: ${C.ink}; min-height: 2.75rem; display: inline-flex; align-items: center; text-decoration-thickness: 1px; text-underline-offset: 0.25em; }
  a:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;
const digits = (s) => String(s || '').replace(/[^\d+]/g, '');

function ContactWitnesses() {
  const { t } = useLanguage();
  const w = useLocalizedContent('witnesses');
  const persons = (Array.isArray(w.persons) ? w.persons : []).filter((p) => p && p.name);
  if (!persons.length) return null;
  return (
    <Section id="witnesses" $tone="shell">
      <Inner>
        <Aside><Title>{w.title || t(STRINGS, 'witnesses')}</Title></Aside>
        <Body>
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
        </Body>
      </Inner>
    </Section>
  );
}
export default ContactWitnesses;
