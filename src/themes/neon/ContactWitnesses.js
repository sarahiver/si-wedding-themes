// src/components/ContactWitnesses.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(0,255,255,0.2); }
  50% { box-shadow: 0 0 50px rgba(0,255,255,0.4); }
`;

const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: 150px 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: #00ff88;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  
  &::before {
    content: '> ';
    color: #ff00ff;
  }
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;
  
  span {
    color: #00ffff;
    text-shadow: 0 0 20px rgba(0,255,255,0.5);
  }
`;

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 20px;
`;

const WitnessesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const WitnessCard = styled.div`
  position: relative;
  padding: 50px;
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$color || '#00ffff'}30;
  text-align: center;
  animation: ${fadeInUp} 0.8s ease forwards;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0;
  transition: all 0.4s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: conic-gradient(
      from 0deg,
      transparent,
      ${p => p.$color || '#00ffff'}50,
      transparent,
      transparent
    );
    z-index: -1;
    animation: ${rotateGlow} 8s linear infinite;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: ${p => p.$color || '#00ffff'};
    transform: translateY(-10px);
    
    &::before {
      opacity: 1;
    }
  }
`;

const AvatarWrapper = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 auto 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    border: 2px solid ${p => p.$color || '#00ffff'}50;
    animation: ${glowPulse} 3s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: -10px;
    border: 1px solid ${p => p.$color || '#00ffff'}20;
  }
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${p => p.$color || '#00ffff'}20, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: filter 0.3s ease;
    
    ${WitnessCard}:hover & {
      filter: grayscale(0%);
    }
  }
  
  svg {
    width: 60px;
    height: 60px;
    color: ${p => p.$color || '#00ffff'};
    opacity: 0.5;
  }
`;

const RoleBadge = styled.div`
  display: inline-block;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.7rem;
  color: ${p => p.$color || '#00ffff'};
  letter-spacing: 0.3em;
  text-transform: uppercase;
  padding: 8px 20px;
  border: 1px solid ${p => p.$color || '#00ffff'}30;
  margin-bottom: 20px;
  background: ${p => p.$color || '#00ffff'}10;
`;

const WitnessName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
`;

const Relation = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 30px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.7);
  padding: 12px 20px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  text-decoration: none;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${p => p.$color || '#00ffff'};
  }
  
  &:hover {
    background: ${p => p.$color || '#00ffff'}10;
    border-color: ${p => p.$color || '#00ffff'}30;
    color: #fff;
  }
`;

const InfoNote = styled.div`
  margin-top: 60px;
  text-align: center;
  padding: 30px;
  background: rgba(255,0,255,0.05);
  border: 1px solid rgba(255,0,255,0.2);
  
  p {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.6);
    
    strong {
      color: #ff00ff;
    }
  }
`;

function ContactWitnesses({
  witnesses = [
    {
      id: 1,
      name: 'Alex',
      role: 'Trauzeugin',
      relation: 'Beste Freundin der Braut seit 15 Jahren',
      color: '#ff00ff',
      image: null,
      phone: '+49 170 1234567',
      email: 'sarah@example.com'
    },
    {
      id: 2,
      name: 'Jordan',
      role: 'Trauzeuge',
      relation: 'Bruder des Bräutigams',
      color: '#00ffff',
      image: null,
      phone: '+49 171 7654321',
      email: 'max@example.com'
    }
  ],
  note = 'Bei Fragen zur Hochzeit, Überraschungen oder Geschenkideen sind wir eure Ansprechpartner!'
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="witnesses">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>contact_witnesses.init()</Eyebrow>
          <Title>Eure <span>Trauzeugen</span></Title>
          <Subtitle>Bei Fragen oder Überraschungen sind wir für euch da!</Subtitle>
        </Header>
        
        <WitnessesGrid>
          {witnesses.map((witness, i) => (
            <WitnessCard key={witness.id} $color={witness.color} $delay={`${i * 0.2}s`}>
              <AvatarWrapper $color={witness.color}>
                <Avatar $color={witness.color}>
                  {witness.image ? (
                    <img src={witness.image} alt={witness.name} />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                </Avatar>
              </AvatarWrapper>
              
              <RoleBadge $color={witness.color}>{witness.role}</RoleBadge>
              <WitnessName>{witness.name}</WitnessName>
              <Relation>{witness.relation}</Relation>
              
              <ContactInfo>
                {witness.phone && (
                  <ContactItem href={`tel:${witness.phone}`} $color={witness.color}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    {witness.phone}
                  </ContactItem>
                )}
                
                {witness.email && (
                  <ContactItem href={`mailto:${witness.email}`} $color={witness.color}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    {witness.email}
                  </ContactItem>
                )}
              </ContactInfo>
            </WitnessCard>
          ))}
        </WitnessesGrid>
        
        {note && (
          <InfoNote>
            <p><strong>💬 Hinweis:</strong> {note}</p>
          </InfoNote>
        )}
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
