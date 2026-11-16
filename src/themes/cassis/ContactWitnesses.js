// src/themes/cassis/ContactWitnesses.js – Trauzeugen und Ansprechpersonen
import React from 'react';
import styled from 'styled-components';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, Section, Inner, Title } from './shared';

const List = styled.ul`list-style: none; margin: 0; padding: 0; display: grid; gap: 2rem;`;
const Person = styled.li`display: grid; grid-template-columns: 5.5rem 1fr; gap: 1.25rem; align-items: center;`;
const Avatar = styled.div`
  width: 5.5rem; height: 5.5rem; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.28);
  display: flex; align-items: center; justify-content: center; font-size: 1.75rem; color: #fff;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const Name = styled.p`margin: 0; font-size: 1.5rem; line-height: 1.2; overflow-wrap: anywhere;`;
const Role = styled.p`margin: 0.15rem 0 0.4rem; font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase;`;
const Links = styled.p`
  margin: 0; display: flex; flex-wrap: wrap; gap: 0.25rem 1.1rem;
  a { color: #fff; font-size: 1.0625rem; min-height: 2.75rem; display: inline-flex; align-items: center; text-underline-offset: 0.2em; }
  a:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;
const digits = (s) => String(s || '').replace(/[^\d+]/g, '');

function ContactWitnesses() {
  const { t } = useLanguage();
  const w = useLocalizedContent('witnesses');
  const persons = (Array.isArray(w.persons) ? w.persons : []).filter((p) => p && p.name);
  if (!persons.length) return null;
  return (
    <Section id="witnesses" $tone="blue">
      <Inner>
        <Title $align="left">{w.title || t(STRINGS, 'witnesses')}</Title>
        <List>
          {persons.map((p, i) => (
            <Person key={i}>
              <Avatar aria-hidden="true">{p.image ? <img src={p.image} alt="" loading="lazy" /> : (p.name || '').trim().charAt(0).toUpperCase()}</Avatar>
              <div>
                <Name>{p.name}</Name>
                {p.role && <Role>{p.role}</Role>}
                <Links>
                  {p.phone && <a href={`tel:${digits(p.phone)}`}>{t(STRINGS, 'call')}</a>}
                  {p.whatsapp && <a href={`https://wa.me/${digits(p.whatsapp).replace('+', '')}`} target="_blank" rel="noopener noreferrer">{t(STRINGS, 'whatsapp')}</a>}
                  {p.email && <a href={`mailto:${p.email}`}>{t(STRINGS, 'mail')}</a>}
                </Links>
              </div>
            </Person>
          ))}
        </List>
      </Inner>
    </Section>
  );
}
export default ContactWitnesses;
