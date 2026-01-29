import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const Subtitle = styled.p`font-size: 0.85rem; color: var(--medium); text-align: center; margin-bottom: 1rem;`;
const WitnessCard = styled.div`background: var(--off-white); padding: 1rem; margin-bottom: 0.75rem; text-align: center;`;
const WitnessName = styled.h3`font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.1rem;`;
const WitnessRole = styled.p`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--light); margin-bottom: 0.75rem;`;
const WitnessBtn = styled.a`display: block; padding: 0.5rem; font-size: 0.8rem; font-weight: 600; background: var(--white); color: var(--dark); margin-bottom: 0.3rem; &:hover { background: var(--pale); }`;

function ContactWitnesses({ side = 'right' }) {
  const { content } = useWedding();
  const d = content?.witnesses || {};
  const persons = d.persons || [
    { name: 'Lisa Müller', role: 'Trauzeugin', email: 'lisa@example.com' },
    { name: 'Thomas Schmidt', role: 'Trauzeuge', email: 'thomas@example.com' },
  ];

  return (
    <ContentBranch side={side} eyebrow="Ansprechpartner" title={d.title || 'Trauzeugen'}>
      <Subtitle>{d.subtitle || 'Bei Fragen zu Überraschungen'}</Subtitle>
      {persons.map((p, i) => (
        <WitnessCard key={i}>
          <WitnessName>{p.name}</WitnessName>
          <WitnessRole>{p.role}</WitnessRole>
          {p.email && <WitnessBtn href={`mailto:${p.email}`}>E-Mail</WitnessBtn>}
          {p.phone && <WitnessBtn href={`tel:${p.phone.replace(/\s/g, '')}`}>Anrufen</WitnessBtn>}
        </WitnessCard>
      ))}
    </ContentBranch>
  );
}
export default ContactWitnesses;
