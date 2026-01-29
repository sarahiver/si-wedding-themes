// FAQContent
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div``;
const Eyebrow = styled.p`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--light); margin-bottom: 0.5rem; text-align: center;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: 1.8rem; font-weight: 300; color: var(--black); margin-bottom: 1rem; text-align: center;`;
const List = styled.div`text-align: left; max-height: 220px; overflow-y: auto;`;
const Item = styled.div`border-bottom: 1px solid var(--off-white);`;
const Question = styled.button`width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; text-align: left;`;
const QText = styled.span`font-family: var(--font-serif); font-size: 0.95rem; color: var(--black); flex: 1; padding-right: 0.5rem;`;
const Icon = styled.span`font-size: 1rem; color: var(--light); transition: transform 0.3s; transform: rotate(${p => p.$open ? '45deg' : '0'});`;
const Answer = styled.div`max-height: ${p => p.$open ? '150px' : '0'}; overflow: hidden; transition: max-height 0.3s;`;
const AText = styled.p`font-size: 0.85rem; color: var(--medium); line-height: 1.6; padding-bottom: 0.75rem;`;

function FAQContent() {
  const { content } = useWedding();
  const data = content?.faq || {};
  const title = data.title || 'FAQ';
  const questions = data.questions?.length > 0 ? data.questions : [
    { question: 'Kann ich eine Begleitung mitbringen?', answer: 'Schaut auf eure Einladung.' },
    { question: 'Gibt es Parkplätze?', answer: 'Ja, kostenlose Parkplätze vorhanden.' },
    { question: 'Was ist der Dresscode?', answer: 'Festlich elegant.' },
  ];
  const [open, setOpen] = useState(null);

  return (
    <Wrapper>
      <Eyebrow>Noch Fragen?</Eyebrow>
      <Title>{title}</Title>
      <List>
        {questions.map((q, i) => (
          <Item key={i}>
            <Question onClick={() => setOpen(open === i ? null : i)}>
              <QText>{q.question}</QText>
              <Icon $open={open === i}>+</Icon>
            </Question>
            <Answer $open={open === i}><AText>{q.answer}</AText></Answer>
          </Item>
        ))}
      </List>
    </Wrapper>
  );
}

export default FAQContent;
