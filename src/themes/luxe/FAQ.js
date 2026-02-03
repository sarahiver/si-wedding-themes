// Luxe FAQ
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-cream); color: var(--luxe-anthracite);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-anthracite); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const FAQList = styled.div``;
const FAQItem = styled.div`border-bottom: 1px solid var(--luxe-pearl); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.1}s; &:first-child { border-top: 1px solid var(--luxe-pearl); }`;
const Question = styled.button`width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0; font-family: var(--font-display); font-size: 1.1rem; font-weight: 400; font-style: italic; color: var(--luxe-anthracite); text-align: left; transition: color 0.3s ease; &:hover { color: var(--luxe-gold); }`;
const Icon = styled.span`font-size: 1.25rem; color: var(--luxe-gold); transition: transform 0.3s ease; transform: rotate(${p => p.$open ? '45deg' : '0'});`;
const Answer = styled.div`max-height: ${p => p.$open ? '500px' : '0'}; overflow: hidden; transition: max-height 0.5s var(--ease-out-expo);`;
const AnswerText = styled.p`font-family: var(--font-body); font-size: 0.9rem; font-weight: 300; line-height: 1.8; color: var(--luxe-graphite); padding-bottom: 1.5rem;`;

function FAQ() {
  const { content } = useWedding();
  const data = content?.faq || {};
  const title = data?.title || 'FAQ';
  const questions = Array.isArray(data?.questions) ? data.questions : [];

  // Keine Default-FAQs - zeige nichts wenn keine Fragen angelegt
  if (questions.length === 0) return null;

  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header><Eyebrow $visible={visible}>Gut zu wissen</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <FAQList>
          {questions.map((item, i) => (
            <FAQItem key={i} $visible={visible} $index={i}>
              <Question onClick={() => setOpenIndex(openIndex === i ? null : i)}>{item.question}<Icon $open={openIndex === i}>+</Icon></Question>
              <Answer $open={openIndex === i}><AnswerText>{item.answer}</AnswerText></Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
}

export default FAQ;
