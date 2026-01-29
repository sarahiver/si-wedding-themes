// Botanical Contact - Privacy Protected
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--green-fern);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.15};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-tight);
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-mint);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 4.5rem);
  color: var(--bg-cream);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--green-mint);
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Card = styled.div`
  background: var(--bg-cream);
  padding: 2rem;
  border-radius: 35px;
  box-shadow: var(--shadow-medium);
  max-width: 400px;
  margin: 0 auto;
`;

const ContactButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: var(--bg-fog);
  color: var(--green-forest);
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: all 0.3s var(--ease-nature);
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    background: var(--green-mint);
    transform: translateY(-3px);
    box-shadow: var(--shadow-soft);
  }
  
  span {
    font-size: 1.25rem;
  }
`;

const EmptyText = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-muted);
  font-style: italic;
`;

function Contact() {
  const { project, content } = useWedding();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const email = contactData.couple_email || project?.couple_email;
  const phone = contactData.couple_phone || project?.couple_phone;

  return (
    <Section id="contact">
      <DecoLeaf $size="150px" $color="var(--green-mint)" $opacity={0.1} style={{ top: '10%', left: '-5%' }} />
      <DecoLeaf $size="100px" $color="var(--green-sage)" $opacity={0.08} style={{ bottom: '15%', right: '-3%' }} $duration="12s" />
      
      <Container>
        <Eyebrow>📞 Fragen?</Eyebrow>
        <Title>{title}</Title>
        <Subtitle>Bei Fragen sind wir jederzeit für euch da!</Subtitle>
        
        <Card>
          {email && (
            <ContactButton href={`mailto:${email}`}>
              <span>✉️</span>
              E-Mail schreiben
            </ContactButton>
          )}
          {phone && (
            <ContactButton href={`tel:${phone.replace(/\s/g, '')}`}>
              <span>📱</span>
              Anrufen
            </ContactButton>
          )}
          {!email && !phone && (
            <EmptyText>Kontaktdaten werden noch hinzugefügt</EmptyText>
          )}
        </Card>
      </Container>
    </Section>
  );
}

export default Contact;
