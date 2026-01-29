// Botanical Contact - Contact info in hole
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
  margin-bottom: 1.5rem;
`;

const ButtonsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 200px;
`;

const ContactBtn = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--off-white);
  color: var(--dark);
  text-align: center;
  transition: background 0.2s;
  
  &:hover {
    background: var(--pale);
  }
`;

function Contact() {
  const { project, content } = useWedding();
  const { mainHole } = useKnotholes();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const email = contactData.couple_email || project?.couple_email;
  const phone = contactData.couple_phone || project?.couple_phone;

  return (
    <Section data-section="contact">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Fragen?</Eyebrow>
        <Title>{title}</Title>
        <Subtitle>Wir sind für euch da</Subtitle>
        
        <ButtonsStack>
          {email && (
            <ContactBtn href={`mailto:${email}`}>
              E-Mail schreiben
            </ContactBtn>
          )}
          {phone && (
            <ContactBtn href={`tel:${phone.replace(/\s/g, '')}`}>
              Anrufen
            </ContactBtn>
          )}
        </ButtonsStack>
      </HoleContent>
    </Section>
  );
}

export default Contact;
