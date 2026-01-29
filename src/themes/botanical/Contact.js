import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const Subtitle = styled.p`font-size: 0.9rem; color: var(--medium); text-align: center; margin-bottom: 1.5rem;`;
const BtnStack = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
const ContactBtn = styled.a`display: block; padding: 0.85rem; font-size: 0.9rem; font-weight: 600; background: var(--off-white); color: var(--dark); text-align: center; transition: background 0.2s; &:hover { background: var(--pale); }`;

function Contact({ side = 'left' }) {
  const { project, content } = useWedding();
  const d = content?.contact || {};
  const email = d.couple_email || project?.couple_email;
  const phone = d.couple_phone || project?.couple_phone;

  return (
    <ContentBranch side={side} eyebrow="Fragen?" title={d.title || 'Kontakt'} align="center">
      <Subtitle>Wir sind für euch da</Subtitle>
      <BtnStack>
        {email && <ContactBtn href={`mailto:${email}`}>E-Mail schreiben</ContactBtn>}
        {phone && <ContactBtn href={`tel:${phone.replace(/\s/g, '')}`}>Anrufen</ContactBtn>}
      </BtnStack>
    </ContentBranch>
  );
}
export default Contact;
