import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: var(--cream);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${p => p.$isOpen ? 'var(--sage)' : 'transparent'};
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$index * 0.08}s;
`;

const Question = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  
  h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--forest);
    flex: 1;
    padding-right: 1rem;
  }
`;

const Icon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--sage-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: rotate(${p => p.$isOpen ? '45deg' : '0'});
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: var(--sage);
  }
  &::before { width: 12px; height: 2px; }
  &::after { width: 2px; height: 12px; }
`;

const Answer = styled.div`
  max-height: ${p => p.$isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
  
  p {
    font-family: 'Lato', sans-serif;
    font-size: 0.95rem;
    color: var(--text-light);
    line-height: 1.8;
    padding: 0 1.5rem 1.5rem;
  }
`;

function FAQ({ content = {} }) {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const title = content.title || 'Häufige Fragen';
  const questions = content.questions || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="faq">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Gut zu wissen</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <FAQList>
          {questions.map((faq, i) => (
            <FAQItem key={i} $visible={visible} $index={i} $isOpen={openIndex === i}>
              <Question onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <h4>{faq.question || faq.q}</h4>
                <Icon $isOpen={openIndex === i} />
              </Question>
              <Answer $isOpen={openIndex === i}>
                <p>{faq.answer || faq.a}</p>
              </Answer>
            </FAQItem>
          ))}
        </FAQList>
      </Container>
    </Section>
  );
}

export default FAQ;
