import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
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
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const FAQList = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--editorial-light-gray);
  
  &:first-child {
    border-top: 1px solid var(--editorial-light-gray);
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    padding-left: 1rem;
  }
`;

const QuestionText = styled.span`
  font-family: var(--font-headline);
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  letter-spacing: -0.01em;
`;

const QuestionIcon = styled.span`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$open ? 'var(--editorial-red)' : 'var(--editorial-light-gray)'};
  color: ${p => p.$open ? 'var(--editorial-white)' : 'var(--editorial-black)'};
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  transition: all 0.3s ease;
`;

const FAQAnswer = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.4s ease;
`;

const AnswerContent = styled.div`
  padding: 0 0 2rem 0;
`;

const AnswerLine = styled.div`
  width: 40px;
  height: 2px;
  background: var(--editorial-red);
  margin-bottom: 1rem;
`;

const AnswerText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.1rem);
  color: var(--editorial-gray);
  line-height: 1.8;
  margin: 0;
`;

// ============================================
// COMPONENT
// ============================================

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'FAQ';
  const description = faqData.description || 'Die häufigsten Fragen – und unsere Antworten.';
  const questions = faqData.questions || [];
  
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const defaultQuestions = [
    { 
      question: 'Darf ich eine Begleitung mitbringen?', 
      answer: 'Bitte haltet euch an die Namen auf eurer Einladung. Bei Fragen meldet euch gerne bei uns.' 
    },
    { 
      question: 'Sind Kinder eingeladen?', 
      answer: 'Wir feiern diesen besonderen Tag gerne mit euren Kindern! Für Betreuung und Beschäftigung ist gesorgt.' 
    },
    { 
      question: 'Gibt es einen Dresscode?', 
      answer: 'Festlich elegant – das bedeutet Anzug oder schickes Kleid. Bitte vermeidet komplett weiße Outfits.' 
    },
    { 
      question: 'Wie sieht es mit Fotos aus?', 
      answer: 'Wir haben einen professionellen Fotografen. Genießt den Moment – aber teilt gerne eure Schnappschüsse in unserer Fotogalerie!' 
    },
    { 
      question: 'Gibt es vegetarische/vegane Optionen?', 
      answer: 'Ja! Bitte gebt bei eurer RSVP-Antwort eure Ernährungswünsche an, damit wir entsprechend planen können.' 
    },
    { 
      question: 'Wo kann ich übernachten?', 
      answer: 'Wir haben Zimmerkontingente in nahegelegenen Hotels reserviert. Die Details findet ihr unter "Unterkünfte".' 
    },
  ];

  const items = questions.length > 0 ? questions : defaultQuestions;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Fragen & Antworten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <FAQList $visible={visible}>
          {items.map((item, i) => (
            <FAQItem key={i}>
              <FAQQuestion onClick={() => toggleItem(i)}>
                <QuestionText>{item.question}</QuestionText>
                <QuestionIcon $open={openIndex === i}>
                  {openIndex === i ? '−' : '+'}
                </QuestionIcon>
              </FAQQuestion>
              
              <FAQAnswer $open={openIndex === i}>
                <AnswerContent>
                  <AnswerLine />
                  <AnswerText>{item.answer}</AnswerText>
                </AnswerContent>
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
}

export default FAQ;
