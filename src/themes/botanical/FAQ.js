import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  border-bottom: 1px solid var(--zen-line-light);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  transition-delay: ${p => p.$delay}s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
`;

const QuestionText = styled.span`
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--zen-text);
  flex: 1;
  padding-right: 1rem;
`;

const Icon = styled.span`
  font-size: 1.2rem;
  color: var(--zen-text-muted);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '45deg' : '0'});
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AnswerText = styled.p`
  font-size: 0.9rem;
  color: var(--zen-text-light);
  line-height: 1.7;
  padding-bottom: 1.25rem;
  margin: 0;
`;

function FAQ() {
  const { content } = useWedding();
  const data = content?.faq || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  
  const title = data.title || 'FAQ';
  const questions = data.questions?.length > 0 ? data.questions : [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Bitte schaut auf eure Einladung.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze sind vorhanden.' },
    { question: 'Was ist der Dresscode?', answer: 'Festlich elegant in gedeckten Farben.' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="faq" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <List>
          {questions.map((q, i) => (
            <Item key={i} className={visible ? 'visible' : ''} $delay={0.1 + i * 0.05}>
              <Question onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <QuestionText>{q.question}</QuestionText>
                <Icon $open={openIndex === i}>+</Icon>
              </Question>
              <Answer $open={openIndex === i}>
                <AnswerText>{q.answer}</AnswerText>
              </Answer>
            </Item>
          ))}
        </List>
      </Content>
    </Section>
  );
}

export default FAQ;
