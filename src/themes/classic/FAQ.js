import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-white);`;
const Container = styled.div`max-width: 750px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;

const Item = styled.div`border-bottom: 1px solid var(--classic-border); opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.6s ease forwards; animation-delay: ${p.$delay};`}`;
const Question = styled.button`
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 0; background: none; border: none; text-align: left;
  font-family: var(--font-display); font-size: 1.2rem; font-weight: 400;
  color: var(--classic-charcoal); cursor: pointer; transition: color 0.3s;
  &:hover { color: var(--classic-gold-dark); }
`;
const Arrow = styled.span`
  font-size: 1.2rem; color: var(--classic-gold); transition: transform 0.3s;
  transform: ${p => p.$open ? 'rotate(45deg)' : 'rotate(0)'};
`;
const Answer = styled.div`
  max-height: ${p => p.$open ? '500px' : '0'}; overflow: hidden; transition: max-height 0.4s ease;
  p { font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); line-height: 1.8; padding-bottom: 1.5rem; }
`;

const DEFAULT_FAQS = [
  { q: 'Dürfen wir jemanden mitbringen?', a: 'Bitte habt Verständnis, dass wir nur die eingeladenen Personen berücksichtigen können.' },
  { q: 'Gibt es vegetarische/vegane Optionen?', a: 'Selbstverständlich! Bitte gebt uns bei der RSVP Bescheid.' },
  { q: 'Kann ich Fotos machen?', a: 'Bitte verzichtet während der Trauung auf Fotos. Danach dürft ihr gerne knipsen!' },
  { q: 'Gibt es Parkplätze?', a: 'Ja, direkt am Veranstaltungsort stehen ausreichend Parkplätze zur Verfügung.' },
];

function FAQ() {
  const { content } = useWedding();
  const faqData = content?.faq || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const title = faqData.title || 'Häufige Fragen';
  const faqs = faqData.items?.length ? faqData.items : DEFAULT_FAQS;

  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);

  return (
    <Section id="faq" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Gut zu wissen</Eyebrow><Title $v={visible}>{title}</Title></Header>
        {faqs.map((faq, i) => (
          <Item key={i} $v={visible} $delay={`${0.3 + i * 0.08}s`}>
            <Question onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              {faq.q || faq.question || faq.frage}
              <Arrow $open={openIdx === i}>+</Arrow>
            </Question>
            <Answer $open={openIdx === i}><p>{faq.a || faq.answer || faq.antwort}</p></Answer>
          </Item>
        ))}
      </Container>
    </Section>
  );
}
export default FAQ;
