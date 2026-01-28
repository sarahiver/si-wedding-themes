// Contemporary Contact
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--coral);
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--black);
  opacity: 0.6;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--white);
  opacity: 0.9;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: var(--shadow-xl);
  padding: 2.5rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
  padding: 1rem;
  margin-bottom: 1rem;
  border: 3px solid var(--gray-200);
  transition: all 0.2s ease;
  
  &:last-child { margin-bottom: 0; }
  
  &:hover {
    background: var(--yellow);
    border-color: var(--black);
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-sm);
  }
`;

const Icon = styled.span`
  font-size: 1.5rem;
`;

function Contact() {
  const { project, content } = useWedding();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const email = contactData.couple_email || project?.couple_email;
  const phone = contactData.couple_phone || project?.couple_phone;

  return (
    <Section id="contact">
      <Container>
        <Eyebrow>📞 Fragen?</Eyebrow>
        <Title>{title}</Title>
        <Subtitle>Bei Fragen sind wir jederzeit für euch da!</Subtitle>
        
        <Card>
          {email && (
            <ContactItem href={`mailto:${email}`}>
              <Icon>✉️</Icon>
              {email}
            </ContactItem>
          )}
          {phone && (
            <ContactItem href={`tel:${phone.replace(/\s/g, '')}`}>
              <Icon>📱</Icon>
              {phone}
            </ContactItem>
          )}
        </Card>
      </Container>
    </Section>
  );
}

export default Contact;
