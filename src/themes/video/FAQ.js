import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 600px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const FAQList = styled.div`display: flex; flex-direction: column; gap: 0.5rem; text-align: left;`;
const FAQItem = styled.div`border-bottom: 1px solid rgba(255,255,255,0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.08}s;`;
const Question = styled.button`width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; font-family: var(--font-primary); font-size: 0.9rem; font-weight: 500; color: var(--video-white); text-align: left; transition: color 0.3s ease; &:hover { color: var(--video-accent); }`;
const Icon = styled.span`font-size: 1.25rem; color: var(--video-accent); transition: transform 0.3s ease; transform: rotate(${p => p.$open ? '45deg' : '0'});`;
const Answer = styled.div`max-height: ${p => p.$open ? '200px' : '0'}; overflow: hidden; transition: max-height 0.4s ease;`;
const AnswerText = styled.p`font-family: var(--font-primary); font-size: 0.85rem; color: var(--video-silver); padding-bottom: 1rem; line-height: 1.7;`;

function FAQ() {
  const { content } = useWedding();
  const data = content?.faq || {};
  const title = data.title || 'FAQ';
  const questions = Array.isArray(data.questions) ? data.questions : [
    { question: 'Gibt es einen Dresscode?', answer: 'Elegante Abendgarderobe.' },
    { question: 'Sind Kinder willkommen?', answer: 'Ja, Kinder sind herzlich willkommen.' },
    { question: 'Gibt es Parkplaetze?', answer: 'Kostenlose Parkplaetze stehen zur Verfuegung.' }
  ];
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="faq">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Gut zu wissen</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <FAQList>
          {questions.map((item, i) => (
            <FAQItem key={i} $visible={visible} $index={i}>
              <Question onClick={() => setOpenIndex(openIndex === i ? null : i)}>{item.question}<Icon $open={openIndex === i}>+</Icon></Question>
              <Answer $open={openIndex === i}><AnswerText>{item.answer}</AnswerText></Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Content>
    </SectionWrapper>
  );
}

export default FAQ;
