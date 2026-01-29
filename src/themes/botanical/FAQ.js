import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-cream);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const FAQList = styled.div`display: flex; flex-direction: column; gap: 1rem;`;
const FAQItem = styled.div`background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(107, 127, 94, 0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.1}s;`;
const Question = styled.button`width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; font-family: var(--font-handwritten); font-size: 1.25rem; color: var(--botanical-forest); text-align: left; background: ${p => p.$open ? 'var(--botanical-mint)' : 'white'}; transition: all 0.3s ease; &:hover { background: var(--botanical-mint); }`;
const Icon = styled.span`font-size: 1.5rem; transition: transform 0.3s ease; transform: rotate(${p => p.$open ? '45deg' : '0'});`;
const Answer = styled.div`max-height: ${p => p.$open ? '500px' : '0'}; overflow: hidden; transition: max-height 0.5s ease;`;
const AnswerText = styled.p`font-family: var(--font-body); font-size: 0.95rem; line-height: 1.8; color: var(--botanical-brown); padding: 0 1.5rem 1.5rem;`;

function FAQ() {
  const { content } = useWedding();
  const data = content?.faq || {};
  const title = data.title || 'Haeufige Fragen';
  const questions = Array.isArray(data.questions) ? data.questions : [
    { question: 'Gibt es einen Dresscode?', answer: 'Gartenparty-Eleganz! Bequeme aber schicke Kleidung in hellen, natuerlichen Farben.' },
    { question: 'Sind Kinder willkommen?', answer: 'Ja! Kinder sind herzlich willkommen. Wir haben einen Spielbereich vorbereitet. 🌻' },
    { question: 'Wo kann ich parken?', answer: 'Kostenlose Parkplaetze stehen auf dem Gelaende zur Verfuegung.' },
    { question: 'Gibt es vegetarisches Essen?', answer: 'Selbstverstaendlich! Bitte teilt uns eure Wuensche bei der Anmeldung mit.' }
  ];
  
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
        <Header><Eyebrow $visible={visible}>❓ Gut zu wissen</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <FAQList>
          {questions.map((item, i) => (
            <FAQItem key={i} $visible={visible} $index={i}>
              <Question onClick={() => setOpenIndex(openIndex === i ? null : i)} $open={openIndex === i}>🌿 {item.question}<Icon $open={openIndex === i}>+</Icon></Question>
              <Answer $open={openIndex === i}><AnswerText>{item.answer}</AnswerText></Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
}

export default FAQ;
