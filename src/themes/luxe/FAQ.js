// Luxe FAQ - Elegant Accordion
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--luxe-sand);
`;

const Container = styled.div`
  max-width: var(--container-narrow);
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--luxe-taupe);
  opacity: 0;
  animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards;
  animation-delay: ${p => 0.1 + p.$index * 0.1}s;
  
  &:first-child {
    border-top: 1px solid var(--luxe-taupe);
  }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--luxe-black);
  text-align: left;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--luxe-gold);
  }
`;

const Icon = styled.span`
  font-size: 1.25rem;
  color: var(--luxe-taupe);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '45deg' : '0deg'});
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.5s ease;
`;

const AnswerText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.8;
  color: var(--luxe-charcoal);
  padding-bottom: 1.5rem;
`;

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData?.title || 'Haeufige Fragen';
  const questions = Array.isArray(faqData?.questions) ? faqData.questions : [];
  
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const defaultQuestions = [
    { question: 'Gibt es einen Dresscode?', answer: 'Wir freuen uns ueber elegante Kleidung in gedeckten Farben. Bitte verzichtet auf Weiss und Creme - das ist der Braut vorbehalten.' },
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Auf eurer Einladung steht, fuer wie viele Personen sie gilt. Bei Fragen meldet euch gerne bei uns.' },
    { question: 'Gibt es Parkmöglichkeiten?', answer: 'Ja, es stehen ausreichend kostenlose Parkplaetze zur Verfuegung. Die genaue Adresse findet ihr in der Anfahrtsbeschreibung.' },
    { question: 'Sind Kinder willkommen?', answer: 'Wir feiern diesen Tag gerne mit euren Kindern. Bitte gebt bei der Anmeldung an, ob Kinder dabei sein werden.' },
    { question: 'Gibt es besondere Essensoptionen?', answer: 'Ja, wir bieten vegetarische und vegane Optionen an. Bitte teilt uns Allergien oder besondere Wuensche bei der Anmeldung mit.' }
  ];

  const items = questions.length > 0 ? questions : defaultQuestions;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Gut zu wissen</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <FAQList>
          {items.map((item, i) => (
            <FAQItem key={i} $visible={visible} $index={i}>
              <Question onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                {item.question}
                <Icon $open={openIndex === i}>+</Icon>
              </Question>
              <Answer $open={openIndex === i}>
                <AnswerText>{item.answer}</AnswerText>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
}

export default FAQ;
