// Botanical FAQ - Accordion in hole
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 1.5rem 1rem;
  overflow: hidden;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
`;

const FAQList = styled.div`
  width: 100%;
  max-height: 70%;
  overflow-y: auto;
  text-align: left;
  
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--off-white);
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const QuestionText = styled.span`
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--black);
  flex: 1;
  padding-right: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1rem;
  color: var(--light);
  transition: transform 0.3s;
  transform: rotate(${p => p.$open ? '45deg' : '0deg'});
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '150px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
  line-height: 1.6;
  padding-bottom: 0.75rem;
`;

const SmallHoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--pale);
`;

function FAQ() {
  const { content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'FAQ';
  const questions = faqData.questions || [];
  
  const [openIdx, setOpenIdx] = useState(null);

  const defaultQuestions = [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Schaut auf eure Einladung, dort steht die Personenzahl.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze sind vorhanden.' },
    { question: 'Was ist der Dresscode?', answer: 'Festlich elegant. Denkt an bequeme Schuhe!' },
    { question: 'Gibt es vegetarisches Essen?', answer: 'Ja, bitte bei der Anmeldung angeben.' },
  ];

  const items = questions.length > 0 ? questions : defaultQuestions;

  return (
    <Section data-section="faq">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Noch Fragen?</Eyebrow>
        <Title>{title}</Title>
        
        <FAQList>
          {items.map((item, i) => (
            <FAQItem key={i}>
              <Question onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <QuestionText>{item.question}</QuestionText>
                <Icon $open={openIdx === i}>+</Icon>
              </Question>
              <Answer $open={openIdx === i}>
                <AnswerText>{item.answer}</AnswerText>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </HoleContent>
      
      {secondaryHoles[0] && (
        <SmallHoleContent $hole={secondaryHoles[0]}>?</SmallHoleContent>
      )}
    </Section>
  );
}

export default FAQ;
