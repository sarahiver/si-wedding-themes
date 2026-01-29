// Botanical Tree FAQ
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const FAQList = styled.div``;

const FAQItem = styled.div`
  border-bottom: 1px solid var(--off-white);
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  background: none;
  text-align: left;
  cursor: pointer;
`;

const QuestionText = styled.span`
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--black);
  flex: 1;
  padding-right: 1rem;
`;

const Icon = styled.span`
  font-size: 1.2rem;
  color: var(--light);
  transition: transform 0.3s;
  transform: rotate(${p => p.$open ? '45deg' : '0deg'});
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--medium);
  line-height: 1.6;
  padding-bottom: 1rem;
`;

function FAQ({ side = 'left' }) {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  const title = faqData.title || 'FAQ';
  const questions = faqData.questions || [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Schaut auf eure Einladung.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze sind vorhanden.' },
    { question: 'Was ist der Dresscode?', answer: 'Festlich elegant.' },
    { question: 'Gibt es vegetarisches Essen?', answer: 'Ja, bitte bei der Anmeldung angeben.' },
  ];
  
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <ContentBranch side={side} eyebrow="Noch Fragen?" title={title}>
      <FAQList>
        {questions.map((item, i) => (
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
    </ContentBranch>
  );
}

export default FAQ;
