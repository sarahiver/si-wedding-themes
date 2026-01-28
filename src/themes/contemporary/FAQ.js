// Contemporary FAQ - Accordion with Brutalist Style
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../contexts/WeddingContext';

const float = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -10px) rotate(5deg); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--yellow);
  position: relative;
  overflow: hidden;
`;

const BigQuestion = styled.div`
  position: absolute;
  font-size: clamp(15rem, 40vw, 30rem);
  font-weight: 700;
  color: rgba(0,0,0,0.05);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  line-height: 1;
`;

const FloatingShape = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: var(--coral);
  border: 3px solid var(--black);
  animation: ${float} 8s ease-in-out infinite;
  opacity: 0.3;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--black);
  opacity: 0.6;
  margin-bottom: 0.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.4s ease ${p => p.$index * 0.1}s;
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: ${p => p.$open ? 'var(--coral)' : 'var(--white)'};
  color: ${p => p.$open ? 'var(--white)' : 'var(--black)'};
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${p => p.$open ? 'var(--coral)' : 'var(--gray-100)'};
  }
`;

const Number = styled.span`
  font-size: 0.85rem;
  color: ${p => p.$open ? 'rgba(255,255,255,0.7)' : 'var(--gray-400)'};
  margin-right: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1.5rem;
  transform: rotate(${p => p.$open ? '45deg' : '0deg'});
  transition: transform 0.3s ease;
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AnswerContent = styled.div`
  padding: 1.5rem;
  font-size: 0.95rem;
  color: var(--gray-600);
  line-height: 1.7;
  border-top: 3px solid var(--black);
`;

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'FAQ';
  const questions = faqData.questions || [];
  
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const defaultQuestions = [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'In eurer Einladung steht, für wie viele Personen sie gilt. Falls ihr noch Fragen habt, meldet euch gerne bei uns.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, es gibt ausreichend kostenlose Parkplätze direkt vor der Location. Alternativ empfehlen wir die Anreise mit öffentlichen Verkehrsmitteln.' },
    { question: 'Was sollen wir anziehen?', answer: 'Der Dresscode ist festlich elegant. Bitte beachtet unsere Farbwünsche auf der Dresscode-Seite.' },
    { question: 'Gibt es vegetarisches Essen?', answer: 'Ja! Wir bieten verschiedene Menüoptionen an, darunter vegetarisch und vegan. Bitte gebt eure Präferenz bei der Anmeldung an.' },
    { question: 'Können wir Fotos machen?', answer: 'Während der Trauung bitten wir euch, die Handys wegzulegen – unser Fotograf kümmert sich um alles. Danach: Knipst los und teilt mit unserem Hashtag!' },
  ];

  const items = questions.length > 0 ? questions : defaultQuestions;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="faq">
      <BigQuestion>?</BigQuestion>
      <FloatingShape style={{ top: '15%', left: '5%' }} />
      <FloatingShape style={{ bottom: '20%', right: '8%', borderRadius: '50%' }} />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>❓ Fragen & Antworten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <FAQList>
          {items.map((item, index) => (
            <FAQItem key={index} $index={index} $visible={visible}>
              <Question 
                $open={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>
                  <Number $open={openIndex === index}>0{index + 1}</Number>
                  {item.question}
                </span>
                <Icon $open={openIndex === index}>+</Icon>
              </Question>
              <Answer $open={openIndex === index}>
                <AnswerContent>{item.answer}</AnswerContent>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
}

export default FAQ;
