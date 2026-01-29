// Botanical FAQ - Clean accordion
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--cream-dark);
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 0;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const QuestionText = styled.span`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--forest-deep);
`;

const QuestionIcon = styled.span`
  font-size: 1.25rem;
  color: var(--bark-light);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '45deg' : '0deg'});
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s var(--ease-smooth);
`;

const AnswerText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
  line-height: 1.7;
  padding-bottom: 1.25rem;
`;

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'Häufige Fragen';
  const questions = faqData.questions || [];
  
  const [openIndex, setOpenIndex] = useState(null);

  const defaultQuestions = [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'In eurer Einladung steht, für wie viele Personen sie gilt. Falls ihr Fragen habt, meldet euch gerne.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze sind direkt bei der Location vorhanden.' },
    { question: 'Was ist der Dresscode?', answer: 'Festlich elegant. Bitte beachtet unsere Farbwünsche. Denkt an bequeme Schuhe!' },
    { question: 'Gibt es vegetarisches Essen?', answer: 'Ja! Bitte gebt eure Präferenz bei der Anmeldung an.' },
    { question: 'Dürfen wir während der Trauung fotografieren?', answer: 'Bitte keine Handys während der Zeremonie. Danach gerne!' },
  ];

  const items = questions.length > 0 ? questions : defaultQuestions;

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" data-section="faq">
      <Content>
        <Header>
          <Eyebrow>Noch Fragen?</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <FAQList>
          {items.map((item, index) => (
            <FAQItem key={index}>
              <Question onClick={() => toggle(index)}>
                <QuestionText>{item.question}</QuestionText>
                <QuestionIcon $open={openIndex === index}>+</QuestionIcon>
              </Question>
              <Answer $open={openIndex === index}>
                <AnswerText>{item.answer}</AnswerText>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Content>
    </Section>
  );
}

export default FAQ;
