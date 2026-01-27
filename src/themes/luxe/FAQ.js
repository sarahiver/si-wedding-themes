import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE FAQ - Masonry Card Layout
// Alternative to accordion - visual card grid
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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
`;

const MasonryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const Card = styled.div`
  background: var(--luxe-white);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transition: all 0.4s ease;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.6s ease-out forwards;
    animation-delay: ${p.$delay}s;
  `}
  
  /* Create varied heights for masonry effect */
  ${p => p.$size === 'large' && css`
    grid-row: span 2;
    
    @media (max-width: 600px) {
      grid-row: span 1;
    }
  `}
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0,0,0,0.06);
    transform: translateY(-3px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 0;
    background: var(--luxe-gold);
    transition: height 0.4s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const QuestionNumber = styled.span`
  font-family: var(--font-serif);
  font-size: 3rem;
  font-style: italic;
  color: var(--luxe-gold);
  opacity: 0.3;
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  line-height: 1;
`;

const Question = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
  padding-right: 2rem;
`;

const Answer = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
  line-height: 1.8;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
`;

const MoreSection = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 2.5rem;
  background: var(--luxe-white);
`;

const MoreTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const MoreText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-text-light);
  margin-bottom: 1.5rem;
`;

const ContactButton = styled.a`
  display: inline-block;
  padding: 0.9rem 2rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--luxe-text);
  border: 1px solid var(--luxe-border);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

function FAQ({ faqs }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  
  const defaultFaqs = [
    { 
      q: 'Darf ich eine Begleitung mitbringen?', 
      a: 'Bitte prüft eure Einladung – dort ist vermerkt, ob eine Begleitung inkludiert ist. Bei Fragen meldet euch gerne.',
      icon: '💑',
      size: 'normal'
    },
    { 
      q: 'Gibt es Parkplätze?', 
      a: 'Ja, kostenlose Parkplätze stehen am Veranstaltungsort zur Verfügung. Folgt einfach der Ausschilderung.',
      icon: '🚗',
      size: 'normal'
    },
    { 
      q: 'Bis wann soll ich zu- oder absagen?', 
      a: 'Bitte gebt uns bis zum 1. September 2026 Bescheid, damit wir alles für euch planen können.',
      icon: '📅',
      size: 'large'
    },
    { 
      q: 'Sind Kinder willkommen?', 
      a: 'Wir haben uns für eine Feier nur für Erwachsene entschieden. Wir hoffen auf euer Verständnis.',
      icon: '👶',
      size: 'normal'
    },
    { 
      q: 'Was ist mit Fotos?', 
      a: 'Wir haben einen professionellen Fotografen. Während der Trauung bitten wir um eine "Unplugged Ceremony" – keine Handys bitte. Danach dürft ihr gerne fotografieren!',
      icon: '📸',
      size: 'large'
    },
    { 
      q: 'Gibt es Übernachtungsmöglichkeiten?', 
      a: 'Ja! Unter "Unterkünfte" findet ihr unsere Hotelempfehlungen in der Nähe.',
      icon: '🏨',
      size: 'normal'
    },
    { 
      q: 'Was ist bei Unverträglichkeiten?', 
      a: 'Gebt bitte bei der RSVP alle Allergien und Unverträglichkeiten an. Unser Catering wird alles berücksichtigen.',
      icon: '🍽️',
      size: 'normal'
    },
    { 
      q: 'Wie ist der Ablauf?', 
      a: 'Alle Details findet ihr unter "Ablauf". Grob: Empfang um 14 Uhr, Trauung um 15 Uhr, Dinner ab 18:30 Uhr, Party danach!',
      icon: '⏰',
      size: 'normal'
    },
  ];
  
  const faqData = faqs || defaultFaqs;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <Section id="faq" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow>Gut zu wissen</Eyebrow>
          <Title>Häufige Fragen</Title>
        </Header>
        
        <MasonryGrid>
          {faqData.map((faq, index) => (
            <Card 
              key={index} 
              $visible={visible} 
              $delay={index * 0.1}
              $size={faq.size}
            >
              <QuestionNumber>0{index + 1}</QuestionNumber>
              <Icon>{faq.icon}</Icon>
              <Question>{faq.q}</Question>
              <Answer>{faq.a}</Answer>
            </Card>
          ))}
        </MasonryGrid>
        
        <MoreSection>
          <MoreTitle>Noch Fragen?</MoreTitle>
          <MoreText>Schreibt uns oder wendet euch an unsere Trauzeugen</MoreText>
          <ContactButton href="#contact">Kontakt aufnehmen</ContactButton>
        </MoreSection>
      </Container>
    </Section>
  );
}

export default FAQ;
