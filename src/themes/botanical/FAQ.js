import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: ${0.2 + p.$index * 0.08}s;`}
  
  &:hover {
    background: var(--glass-bg-hover);
  }
`;

const FAQHeader = styled.button`
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  text-align: left;
`;

const Question = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  font-weight: 400;
  color: var(--text-light);
  margin: 0;
`;

const ToggleIcon = styled.span`
  font-size: 1.5rem;
  color: var(--text-muted);
  transition: transform 0.3s ease;
  flex-shrink: 0;
  
  ${p => p.$open && css`
    transform: rotate(45deg);
  `}
`;

const Answer = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
  padding: ${p => p.$open ? '0 1.5rem 1.25rem' : '0 1.5rem'};
`;

const AnswerText = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
`;

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  
  const title = faqData.title || 'FAQ';
  const items = faqData.questions || [];

  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  // Keine Default-FAQs - zeige nichts wenn keine Fragen angelegt
  if (items.length === 0) return null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Häufige Fragen</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <FAQList>
          {items.map((item, i) => (
            <FAQItem key={i} $visible={visible} $index={i}>
              <FAQHeader onClick={() => toggleItem(i)}>
                <Question>{item.question}</Question>
                <ToggleIcon $open={openIndex === i}>+</ToggleIcon>
              </FAQHeader>
              <Answer $open={openIndex === i}>
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
