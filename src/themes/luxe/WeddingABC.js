import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-charcoal);`;
const Container = styled.div`max-width: var(--container-max); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

/* Desktop: Grid */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) { display: none; }
`;
const Card = styled.div`padding: 2rem; background: var(--luxe-anthracite); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.2 + p.$index * 0.05}s;`;
const Letter = styled.span`font-family: var(--font-display); font-size: 2.5rem; font-style: italic; color: var(--luxe-gold); display: block; margin-bottom: 0.5rem;`;
const CardTitle = styled.h3`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.75rem;`;
const CardText = styled.p`font-family: var(--font-body); font-size: 0.85rem; line-height: 1.7; color: var(--luxe-pearl);`;

/* Mobile: Accordion */
const AccordionList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const AccordionItem = styled.div`
  border-bottom: 1px solid rgba(212,175,55,0.1);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.6s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => 0.15 + p.$index * 0.03}s;
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const AccordionLetter = styled.span`
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-style: italic;
  color: var(--luxe-gold);
  min-width: 2rem;
  text-align: center;
`;

const AccordionWord = styled.span`
  flex: 1;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-style: italic;
  color: var(--luxe-cream);
`;

const AccordionChevron = styled.span`
  font-size: 1rem;
  color: var(--luxe-slate);
  transition: transform 0.3s ease;
  transform: rotate(${p => p.$open ? '180deg' : '0deg'});
`;

const AccordionBody = styled.div`
  max-height: ${p => p.$open ? '300px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s var(--ease-out-expo);
`;

const AccordionContent = styled.div`
  padding: 0 0 1.25rem 3rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--luxe-pearl);
`;

function WeddingABC() {
  const { content } = useWedding();
  const data = content?.weddingabc || {};
  const title = data.title || 'Hochzeits-ABC';
  const entries = data.entries || [];

  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (entries.length === 0) return null;

  return (
    <Section ref={sectionRef} id="abc">
      <Container>
        <Header><Eyebrow $visible={visible}>Alles Wissenswerte</Eyebrow><Title $visible={visible}>{title}</Title></Header>

        {/* Desktop: Grid Cards */}
        <Grid>
          {entries.map((entry, i) => (
            <Card key={i} $visible={visible} $index={i}>
              <Letter>{entry.letter}</Letter>
              <CardTitle>{entry.word}</CardTitle>
              <CardText>{entry.description}</CardText>
            </Card>
          ))}
        </Grid>

        {/* Mobile: Accordion */}
        <AccordionList>
          {entries.map((entry, i) => (
            <AccordionItem key={i} $visible={visible} $index={i}>
              <AccordionHeader onClick={() => toggle(i)}>
                <AccordionLetter>{entry.letter}</AccordionLetter>
                <AccordionWord>{entry.word}</AccordionWord>
                <AccordionChevron $open={openIndex === i}>▾</AccordionChevron>
              </AccordionHeader>
              <AccordionBody $open={openIndex === i}>
                <AccordionContent>{entry.description}</AccordionContent>
              </AccordionBody>
            </AccordionItem>
          ))}
        </AccordionList>
      </Container>
    </Section>
  );
}

export default WeddingABC;
