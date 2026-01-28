// Luxe Gifts
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-cream);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;

const Header = styled.div`margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Description = styled.p`font-family: var(--font-sans); font-size: 0.9rem; line-height: 1.8; color: var(--luxe-charcoal); margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s;`;

const BankCard = styled.div`background: var(--luxe-white); padding: 2rem; border: 1px solid var(--luxe-sand); opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.3s;`;
const BankRow = styled.div`display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--luxe-sand); &:last-child { border-bottom: none; }`;
const BankLabel = styled.span`font-family: var(--font-sans); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--luxe-taupe);`;
const BankValue = styled.span`font-family: var(--font-sans); font-size: 0.9rem; color: var(--luxe-black);`;

function Gifts() {
  const { content, project } = useWedding();
  const data = content?.gifts || {};
  const title = data.title || 'Geschenke';
  const description = data.description || 'Eure Anwesenheit ist das schoenste Geschenk. Wer uns dennoch etwas schenken moechte, kann gerne zu unserem Reisefonds beitragen.';
  const iban = data.iban || 'DE89 3704 0044 0532 0130 00';
  const holder = data.account_holder || project?.partner1_name && project?.partner2_name ? `${project.partner1_name} & ${project.partner2_name}` : 'Emma & James';
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
        <Header $visible={visible}><Eyebrow>Aufmerksamkeit</Eyebrow><Title>{title}</Title></Header>
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
