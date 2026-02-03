import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

const Subtitle = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.2s;`}
`;

const WitnessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  padding: 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: ${0.3 + p.$index * 0.1}s;`}
  
  &:hover {
    background: var(--glass-bg-hover);
    transform: translateY(-5px);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 50%, transparent);
    pointer-events: none;
  }
`;

const WitnessImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.15);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const WitnessPlaceholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const Role = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-dim);
  background: rgba(255,255,255,0.05);
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
  margin-bottom: 0.75rem;
`;

const WitnessName = styled.h3`
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--text-light);
  }
`;

function ContactWitnesses() {
  const { content } = useWedding();
  const witnessesData = content?.witnesses || {};
  
  const title = witnessesData.title || 'Trauzeugen';
  const subtitle = witnessesData.subtitle || 'Bei Fragen zu Überraschungen & mehr';
  const witnesses = witnessesData.persons || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultWitnesses = [
    { name: 'Lisa Müller', role: 'Trauzeugin', email: 'lisa@email.de', phone: '+49 123 456789', image: '' },
    { name: 'Max Schmidt', role: 'Trauzeuge', email: 'max@email.de', phone: '+49 123 456789', image: '' },
  ];

  const displayWitnesses = witnesses.length > 0 ? witnesses : defaultWitnesses;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="witnesses" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Ansprechpartner</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <WitnessGrid>
          {displayWitnesses.map((witness, i) => (
            <GlassCard key={i} $visible={visible} $index={i}>
              {witness.image ? (
                <WitnessImage>
                  <img src={witness.image} alt={witness.name} />
                </WitnessImage>
              ) : (
                <WitnessPlaceholder>
                  {witness.role?.toLowerCase().includes('zeugin') ? '👩' : '👨'}
                </WitnessPlaceholder>
              )}
              
              <Role>{witness.role}</Role>
              <WitnessName>{witness.name}</WitnessName>
              
              <ContactInfo>
                {witness.email && (
                  <ContactItem href={`mailto:${witness.email}`}>
                    📧 {witness.email}
                  </ContactItem>
                )}
                {witness.phone && (
                  <ContactItem href={`tel:${witness.phone.replace(/\s/g, '')}`}>
                    📞 {witness.phone}
                  </ContactItem>
                )}
              </ContactInfo>
            </GlassCard>
          ))}
        </WitnessGrid>
      </Container>
    </Section>
  );
}

export default ContactWitnesses;
