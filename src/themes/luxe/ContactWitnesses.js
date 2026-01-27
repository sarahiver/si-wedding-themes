import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE CONTACT WITNESSES - Interactive Cards with Reveal Effect
// Hover to reveal contact details
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--luxe-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-text-light);
  max-width: 450px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(40px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const Card = styled.div`
  position: relative;
  height: 450px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${slideUp} 0.8s ease-out forwards;
    animation-delay: ${p.$index * 0.2}s;
  `}
  
  @media (max-width: 700px) {
    height: 400px;
  }
`;

const CardImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${p => p.$image});
  background-size: cover;
  background-position: center top;
  filter: grayscale(30%);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  
  ${Card}:hover & {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(255,255,255,1) 0%,
    rgba(255,255,255,0.9) 30%,
    rgba(255,255,255,0) 60%
  );
  transition: all 0.4s ease;
  
  ${Card}:hover & {
    background: linear-gradient(
      to top,
      rgba(255,255,255,1) 0%,
      rgba(255,255,255,0.95) 50%,
      rgba(255,255,255,0.7) 100%
    );
  }
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  transform: translateY(${p => p.$expanded ? '0' : '60px'});
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  
  ${Card}:hover & {
    transform: translateY(0);
  }
`;

const Role = styled.p`
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 0.5rem;
`;

const Name = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const Relation = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--luxe-text-light);
  margin-bottom: 1.5rem;
`;

const ContactDetails = styled.div`
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease 0.1s;
  
  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--luxe-gold);
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: var(--luxe-text-muted);
  }
`;

const Divider = styled.div`
  width: 30px;
  height: 1px;
  background: var(--luxe-gold);
  margin: 1rem 0;
  transition: width 0.4s ease;
  
  ${Card}:hover & {
    width: 60px;
  }
`;

const Quote = styled.p`
  font-family: var(--font-serif);
  font-size: 0.9rem;
  font-style: italic;
  color: var(--luxe-text-light);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease 0.2s;
  
  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

function ContactWitnesses({ witnesses }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  
  const defaultWitnesses = [
    {
      name: 'Thomas Mueller',
      role: 'Trauzeuge',
      relation: 'Bester Freund des Bräutigams',
      phone: '+49 123 456789',
      email: 'thomas@example.com',
      quote: 'Für alles rund um den JGA bin ich euer Mann!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    },
    {
      name: 'Lisa Schmidt',
      role: 'Trauzeugin',
      relation: 'Schwester der Braut',
      phone: '+49 123 987654',
      email: 'lisa@example.com',
      quote: 'Ich freue mich auf einen unvergesslichen Tag!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    },
  ];
  
  const witnessData = witnesses || defaultWitnesses;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <Section id="witnesses" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow>Ansprechpartner</Eyebrow>
          <Title>Unsere Trauzeugen</Title>
          <Subtitle>
            Bei Fragen oder für Überraschungen – unsere Trauzeugen helfen gerne weiter
          </Subtitle>
        </Header>
        
        <Grid>
          {witnessData.map((witness, index) => (
            <Card key={index} $visible={visible} $index={index}>
              <CardImage $image={witness.image} />
              <CardOverlay />
              
              <CardContent>
                <Role>{witness.role}</Role>
                <Name>{witness.name}</Name>
                <Relation>{witness.relation}</Relation>
                
                <ContactDetails>
                  <ContactItem href={`tel:${witness.phone}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {witness.phone}
                  </ContactItem>
                  <ContactItem href={`mailto:${witness.email}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {witness.email}
                  </ContactItem>
                  
                  <Divider />
                  <Quote>"{witness.quote}"</Quote>
                </ContactDetails>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
