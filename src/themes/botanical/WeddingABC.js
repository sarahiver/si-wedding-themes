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
  max-width: 1000px;
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

const ABCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) { display: none; }
`;

const ABCCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.6s ease forwards; animation-delay: ${0.2 + p.$index * 0.05}s;`}
  
  &:hover {
    background: rgba(255,255,255,0.05);
    transform: translateX(5px);
  }
`;

const Letter = styled.span`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 300;
  color: var(--text-light);
  opacity: 0.3;
  flex-shrink: 0;
  width: 40px;
  text-align: center;
`;

const Content = styled.div`
  flex: 1;
`;

const Word = styled.h4`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.25rem;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
`;

/* Mobile Accordion */
const AccordionList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1rem;
`;

const AccordionHeaderText = styled.div`
  flex: 1;
`;

const AccordionTitle = styled.span`
  font-family: var(--font-display, Georgia, serif);
  font-size: 1.05rem;
  font-weight: 400;
  color: var(--text-light, #fff);
  display: block;
`;

const AccordionMeta = styled.span`
  font-size: 0.75rem;
  color: var(--text-dim, rgba(255,255,255,0.5));
  margin-top: 0.15rem;
  display: block;
`;

const AccordionChevron = styled.span`
  font-size: 1rem;
  color: var(--sage, #8B9D83);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '180deg' : '0deg'});
`;

const AccordionBody = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const AccordionContent = styled.div`
  padding: 0 0 1.25rem;
`;


function WeddingABC() {
  const { content } = useWedding();
  const abcData = content?.weddingabc || {};
  
  const title = abcData.title || 'Hochzeits-ABC';
  const items = abcData.entries || [];

  const [visible, setVisible] = useState(false);

  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Keine Default-Einträge - zeige nichts wenn keine Einträge angelegt
  if (items.length === 0) return null;

  return (
    <Section id="weddingabc" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Von A bis Z</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <ABCGrid>
          {items.map((item, i) => (
            <ABCCard key={i} $visible={visible} $index={i}>
              <Letter>{item.letter}</Letter>
              <Content>
                <Word>{item.word}</Word>
                <Description>{item.description}</Description>
              </Content>
            </ABCCard>
          ))}
        </ABCGrid>

        {/* Mobile Accordion */}
        <AccordionList>
          {items.map((item, i) => (
            <AccordionItem key={i}>
              <AccordionHeader onClick={() => toggle(i)}>
                <span style={{ fontSize: '1.5rem', fontStyle: 'italic', minWidth: '2rem', textAlign: 'center' }}>{item.letter}</span>
                <AccordionHeaderText>
                  <AccordionTitle>{item.word}</AccordionTitle>
                </AccordionHeaderText>
                <AccordionChevron $open={openIndex === i}>▾</AccordionChevron>
              </AccordionHeader>
              <AccordionBody $open={openIndex === i}>
                <AccordionContent style={{ paddingLeft: '3rem' }}>
                  {item.description}
                </AccordionContent>
              </AccordionBody>
            </AccordionItem>
          ))}
        </AccordionList>
      </Container>
    </Section>
  );
}

export default WeddingABC;
