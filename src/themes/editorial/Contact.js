import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(196, 30, 58, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(196, 30, 58, 0); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-black);
  overflow: hidden;
  position: relative;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(4rem, 8vw, 6rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 15vw, 10rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.85;
  overflow: hidden;
  
  .word {
    display: inline-block;
    overflow: hidden;
  }
  
  .letter {
    display: inline-block;
    opacity: 0;
    
    ${p => p.$visible && css`
      animation: ${letterReveal} 0.5s ease forwards;
    `}
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.6s;
  `}
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactCard = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${scaleIn} 0.8s ease forwards;
    animation-delay: ${0.3 + p.$index * 0.15}s;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 3px;
    background: var(--editorial-red);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ContactImageWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
  
  @media (max-width: 600px) {
    width: 120px;
    height: 120px;
  }
`;

const ContactImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.5}s;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(100%);
    transition: filter 0.4s ease;
  }
  
  ${ContactCard}:hover & img {
    filter: grayscale(0%);
  }
`;

const ContactRing = styled.div`
  position: absolute;
  inset: -10px;
  border: 2px solid var(--editorial-red);
  border-radius: 50%;
  opacity: 0.3;
  animation: ${pulse} 2s ease-in-out infinite;
  animation-delay: ${p => p.$index * 0.5}s;
`;

const ContactPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: linear-gradient(135deg, rgba(196, 30, 58, 0.2), rgba(196, 30, 58, 0.1));
  border-radius: 50%;
`;

const ContactRole = styled.span`
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: var(--editorial-red);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const ContactName = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
`;

const Divider = styled.div`
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 auto 1.5rem;
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--editorial-red);
    border-color: var(--editorial-red);
    color: var(--editorial-white);
    transform: translateY(-3px);
  }
`;

const ContactLinksRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// ============================================
// COMPONENT
// ============================================

function Contact() {
  const { content, coupleNames } = useWedding();
  const contactData = content?.contact || {};
  
  const title = contactData.title || 'Kontakt';
  const subtitle = contactData.subtitle || 'Bei Fragen sind wir für euch da';
  
  // Nutze die einfachen Felder aus dem Admin
  const coupleEmail = contactData.couple_email;
  const couplePhone = contactData.couple_phone;
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const names = coupleNames?.split(/\s*[&+]\s*/) || ['Wir'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const renderTitle = () => {
    let letterIndex = 0;
    return title.split(' ').map((word, wi) => (
      <span key={wi} className="word">
        {word.split('').map((letter, li) => {
          const delay = letterIndex * 0.05 + 0.2;
          letterIndex++;
          return (
            <span key={li} className="letter" style={{ animationDelay: `${delay}s` }}>
              {letter}
            </span>
          );
        })}
        {wi < title.split(' ').length - 1 && '\u00A0'}
      </span>
    ));
  };

  return (
    <Section id="contact" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Meldet euch</Eyebrow>
          <Title $visible={visible}>{renderTitle()}</Title>
          <Subtitle $visible={visible}>{subtitle}</Subtitle>
        </Header>
        
        <ContactCard $visible={visible} $index={0} style={{ maxWidth: '500px', margin: '0 auto' }}>
          <ContactName>{names.join(' & ')}</ContactName>
          <Divider />
          
          <ContactLinksRow>
            {couplePhone && (
              <ContactLink href={`tel:${couplePhone.replace(/\s/g, '')}`}>
                Anrufen
              </ContactLink>
            )}
            {couplePhone && (
              <ContactLink 
                href={`https://wa.me/${couplePhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </ContactLink>
            )}
            {coupleEmail && (
              <ContactLink href={`mailto:${coupleEmail}`}>
                E-Mail
              </ContactLink>
            )}
          </ContactLinksRow>
        </ContactCard>
      </Container>
    </Section>
  );
}

export default Contact;
