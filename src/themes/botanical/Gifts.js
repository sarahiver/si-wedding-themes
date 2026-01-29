import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-paper);`;
const Container = styled.div`max-width: 550px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); margin-bottom: 1.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;
const Description = styled.p`font-family: var(--font-body); font-size: 1rem; line-height: 1.8; color: var(--botanical-brown); margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s;`;

const BankCard = styled.div`background: white; border-radius: 20px; padding: 2rem; box-shadow: 0 10px 30px rgba(107, 127, 94, 0.15); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.3s;`;
const BankIcon = styled.div`font-size: 3rem; margin-bottom: 1rem;`;
const BankRow = styled.div`display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 2px dashed var(--botanical-mint); &:last-child { border-bottom: none; }`;
const BankLabel = styled.span`font-family: var(--font-body); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--botanical-olive);`;
const BankValue = styled.span`font-family: var(--font-body); font-size: 0.95rem; color: var(--botanical-forest);`;

function Gifts() {
  const { content, project } = useWedding();
  const data = content?.gifts || {};
  const title = data.title || 'Geschenke';
  const description = data.description || 'Eure Anwesenheit ist das schoenste Geschenk! Wer uns dennoch etwas schenken moechte, kann gerne zu unserem Gaertchen-Fond beitragen. 🌱';
  const iban = data.iban || 'DE89 3704 0044 0532 0130 00';
  const holder = data.account_holder || (project?.partner1_name && project?.partner2_name ? `${project.partner1_name} & ${project.partner2_name}` : 'Emma & Noah');
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
        <Eyebrow $visible={visible}>🎁 Aufmerksamkeit</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Description $visible={visible}>{description}</Description>
        <BankCard $visible={visible}>
          <BankIcon>🌻</BankIcon>
          <BankRow><BankLabel>Kontoinhaber</BankLabel><BankValue>{holder}</BankValue></BankRow>
          <BankRow><BankLabel>IBAN</BankLabel><BankValue>{iban}</BankValue></BankRow>
          <BankRow><BankLabel>Bank</BankLabel><BankValue>{bank}</BankValue></BankRow>
        </BankCard>
      </Container>
    </Section>
  );
}

export default Gifts;
