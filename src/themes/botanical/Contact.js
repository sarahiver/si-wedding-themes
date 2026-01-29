// Botanical Contact - Clean privacy protected
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream-dark);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: var(--cream);
  padding: 2rem;
`;

const ContactButton = styled.a`
  display: block;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 600;
  background: var(--cream-dark);
  color: var(--forest-deep);
  margin-bottom: 0.75rem;
  transition: background 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    background: var(--forest-mist);
  }
`;

function Contact() {
  const { project, content } = useWedding();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const email = contactData.couple_email || project?.couple_email;
  const phone = contactData.couple_phone || project?.couple_phone;

  return (
    <Section id="contact" data-section="contact">
      <Content>
        <Eyebrow>Fragen?</Eyebrow>
        <Title>{title}</Title>
        <Subtitle>Wir sind für euch da</Subtitle>
        
        <Card>
          {email && (
            <ContactButton href={`mailto:${email}`}>
              E-Mail schreiben
            </ContactButton>
          )}
          {phone && (
            <ContactButton href={`tel:${phone.replace(/\s/g, '')}`}>
              Anrufen
            </ContactButton>
          )}
        </Card>
      </Content>
    </Section>
  );
}

export default Contact;
