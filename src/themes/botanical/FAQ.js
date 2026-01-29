// Botanical FAQ - Growing Leaf Accordion
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
`;

const fadeGrow = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-cream);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.1};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-narrow);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '15px'});
  transition: all 0.6s var(--ease-nature);
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s var(--ease-nature) 0.1s;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: var(--bg-fog);
  border-radius: ${p => p.$open ? '30px 30px 25px 35px' : '30px'};
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  transition: all 0.4s var(--ease-nature);
  opacity: ${p => p.$visible ? 1 : 0};
  animation: ${p => p.$visible ? fadeGrow : 'none'} 0.6s var(--ease-nature) forwards;
  animation-delay: ${p => p.$index * 0.1}s;
  
  ${p => p.$open && css`
    box-shadow: var(--shadow-medium);
    background: var(--bg-cream);
    border: 2px solid var(--green-mint);
  `}
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const QuestionIcon = styled.div`
  width: 45px;
  height: 45px;
  background: ${p => p.$open ? 'var(--green-fern)' : 'var(--green-mint)'};
  color: ${p => p.$open ? 'var(--bg-cream)' : 'var(--green-forest)'};
  border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: all 0.4s var(--ease-nature);
  animation: ${sway} 5s ease-in-out infinite;
  
  ${p => p.$open && css`
    transform: rotate(45deg);
    animation: none;
  `}
`;

const QuestionText = styled.span`
  flex: 1;
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--green-forest);
`;

const QuestionArrow = styled.span`
  font-size: 1.25rem;
  color: var(--green-sage);
  transition: transform 0.4s var(--ease-nature);
  
  ${p => p.$open && css`
    transform: rotate(180deg);
    color: var(--green-fern);
  `}
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  opacity: ${p => p.$open ? 1 : 0};
  padding: ${p => p.$open ? '0 1.5rem 1.5rem 4.5rem' : '0 1.5rem 0 4.5rem'};
  overflow: hidden;
  transition: all 0.5s var(--ease-nature);
  
  @media (max-width: 600px) {
    padding-left: 1.5rem;
  }
`;

const AnswerText = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-medium);
  line-height: 1.8;
  padding-top: 0.5rem;
  border-top: 2px dashed var(--bg-moss);
`;

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'Häufige Fragen';
  const questions = faqData.questions || [];
  
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const defaultQuestions = [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'In eurer Einladung steht, für wie viele Personen sie gilt. Falls ihr noch Fragen habt, meldet euch gerne bei uns.' },
    { question: 'Gibt es Parkplätze vor Ort?', answer: 'Ja, es gibt ausreichend kostenlose Parkplätze direkt bei der Location. Alternativ empfehlen wir die Anreise mit dem ÖPNV.' },
    { question: 'Was ist der Dresscode?', answer: 'Festlich elegant. Bitte beachtet unsere Farbwünsche auf der Dresscode-Seite. Denkt an bequeme Schuhe für den Rasen!' },
    { question: 'Gibt es vegetarisches Essen?', answer: 'Ja! Wir bieten verschiedene Menüoptionen an, darunter vegetarisch und vegan. Bitte gebt eure Präferenz bei der Anmeldung an.' },
    { question: 'Dürfen wir während der Trauung fotografieren?', answer: 'Während der Zeremonie bitten wir euch, die Handys wegzulegen. Unser Fotograf hält alles fest. Danach: Knipst los!' },
    { question: 'Ab wann können wir anreisen?', answer: 'Die Location ist ab 13:30 Uhr geöffnet. Die Trauung beginnt um 14:00 Uhr. Bitte seid rechtzeitig da!' },
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

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section ref={sectionRef} id="faq">
      <DecoLeaf $size="180px" $color="var(--green-sage)" $opacity={0.08} style={{ top: '5%', left: '-5%' }} />
      <DecoLeaf $size="120px" $color="var(--green-mint)" $opacity={0.06} style={{ bottom: '10%', right: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow $visible={visible}>🌿 Noch Fragen?</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <FAQList>
          {items.map((item, index) => (
            <FAQItem 
              key={index} 
              $index={index} 
              $visible={visible}
              $open={openIndex === index}
            >
              <Question onClick={() => toggleQuestion(index)}>
                <QuestionIcon $open={openIndex === index}>
                  🌱
                </QuestionIcon>
                <QuestionText>{item.question}</QuestionText>
                <QuestionArrow $open={openIndex === index}>↓</QuestionArrow>
              </Question>
              <Answer $open={openIndex === index}>
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
