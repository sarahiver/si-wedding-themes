import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-cream); color: var(--luxe-anthracite);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Description = styled.p`font-family: var(--font-body); font-size: 0.95rem; line-height: 1.8; color: var(--luxe-graphite); margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const BankCard = styled.div`background: var(--luxe-anthracite); padding: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.3s;`;
const BankRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--luxe-charcoal); &:last-child { border-bottom: none; }`;
const BankLabel = styled.span`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-slate);`;
const BankValue = styled.span`font-family: var(--font-body); font-size: 0.9rem; color: var(--luxe-cream);`;

function Gifts() {
  const { content, project } = useWedding();
  const data = content?.gifts || {};
  const title = data.title || 'Geschenke';
  const description = data.description || 'Eure Anwesenheit ist das schoenste Geschenk. Wer uns dennoch etwas schenken moechte, kann gerne zu unserem Reisefonds beitragen.';
  const iban = data.iban || 'DE89 3704 0044 0532 0130 00';
  const holder = data.account_holder || (project?.partner1_name && project?.partner2_name ? `${project.partner1_name} & ${project.partner2_name}` : 'Alexandra & Benjamin');
  const bank = data.bank_name || 'Sparkasse';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Eyebrow $visible={visible}>Aufmerksamkeit</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Description $visible={visible}>{description}</Description>
        <BankCard $visible={visible}>
          <BankRow><BankLabel>Kontoinhaber</BankLabel><BankValue>{holder}</BankValue></BankRow>
          <BankRow><BankLabel>IBAN</BankLabel><BankValue>{iban}</BankValue></BankRow>
          <BankRow><BankLabel>Bank</BankLabel><BankValue>{bank}</BankValue></BankRow>
        </BankCard>
      </Container>
    </Section>
  );
}

export default Gifts;
