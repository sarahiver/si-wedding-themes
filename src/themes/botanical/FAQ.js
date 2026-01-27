import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: var(--cream);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid ${p => p.isOpen ? 'var(--sage)' : 'transparent'};
  opacity: ${p => p.visible ? 1 : 0};
  transform: translateY(${p => p.visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.index * 0.08}s;
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  
  h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--forest);
    flex: 1;
    padding-right: 1rem;
    transition: color 0.3s ease;
  }
  
  &:hover h4 { color: var(--sage-dark); }
`;

const ToggleIcon = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.isOpen ? 'var(--sage)' : 'var(--cream-dark)'};
  color: ${p => p.isOpen ? 'var(--cream)' : 'var(--sage-dark)'};
  border-radius: 50%;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  transform: rotate(${p => p.isOpen ? '45deg' : '0'});
  flex-shrink: 0;
`;

const Answer = styled.div`
  max-height: ${p => p.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AnswerContent = styled.div`
  padding: 0 1.5rem 1.5rem;
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--text-light);
    line-height: 1.8;
  }
`;

const ContactBox = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: var(--cream);
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px dashed var(--sage-light);
  opacity: ${p => p.visible ? 1 : 0};
  transition: opacity 0.8s ease;
  transition-delay: 0.5s;
  
  h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--forest);
    margin-bottom: 0.75rem;
  }
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--text-light);
  }
  
  a {
    color: var(--sage-dark);
    text-decoration: underline;
    transition: color 0.3s ease;
    
    &:hover { 
      color: var(--sage);
      text-decoration: none; 
    }
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function FAQ({
  faqs = [
    { question: 'Gibt es einen Dresscode?', answer: 'Wir freuen uns über festliche Kleidung in natürlichen, gedeckten Farben – Salbeigrün, Dusty Rose, Creme, Terrakotta. Bitte kein reines Weiß oder Schwarz.' },
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Aufgrund der begrenzten Plätze können leider nur die auf der Einladung genannten Personen teilnehmen. Wir hoffen auf euer Verständnis.' },
    { question: 'Sind Kinder willkommen?', answer: 'Ja! Wir feiern gerne mit euren Kleinen. Es gibt einen betreuten Spielbereich im Garten und kindgerechtes Essen.' },
    { question: 'Was ist mit dem Wetter?', answer: 'Die Trauung findet bei jedem Wetter statt – bei Regen weichen wir in das Gewächshaus aus. Bringt sicherheitshalber einen Schirm mit.' },
    { question: 'Darf ich Fotos machen?', answer: 'Bei der Trauung bitten wir um eine "Unplugged Ceremony" – genießt den Moment ohne Handy. Bei der Feier sind Fotos herzlich willkommen!' },
  ],
  contactEmail = 'hochzeit@olivia-benjamin.de',
}) {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header visible={visible}>
          <Eyebrow>FAQ</Eyebrow>
          <Title>Häufige Fragen</Title>
        </Header>
        
        <FAQList>
          {faqs.map((faq, i) => (
            <FAQItem 
              key={i} 
              index={i} 
              visible={visible}
              isOpen={openIndex === i}
            >
              <Question onClick={() => toggleFAQ(i)}>
                <h4>{faq.question}</h4>
                <ToggleIcon isOpen={openIndex === i}>+</ToggleIcon>
              </Question>
              <Answer isOpen={openIndex === i}>
                <AnswerContent>
                  <p>{faq.answer}</p>
                </AnswerContent>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
        
        {contactEmail && (
          <ContactBox visible={visible}>
            <h4>🌿 Weitere Fragen?</h4>
            <p>Schreibt uns gerne an <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
          </ContactBox>
        )}
      </Container>
    </Section>
  );
}

export default FAQ;
