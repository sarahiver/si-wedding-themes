import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 500px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Description = styled.p`
  font-family: var(--font-accent);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--video-silver);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;
`;

const BankCard = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 2rem;
  text-align: left;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.3s;
`;

const BankRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  
  &:last-child { border-bottom: none; }
`;

const BankLabel = styled.span`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--video-gray);`;
const BankValue = styled.span`font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-white);`;

function Gifts() {
  const { content, project } = useWedding();
  const data = content?.gifts || {};
  const title = data.title || 'Geschenke';
  const description = data.description || 'Eure Anwesenheit ist das schoenste Geschenk. Wer uns dennoch etwas schenken moechte, kann gerne zu unserer Hochzeitsreise beitragen.';
  const iban = data.iban || 'DE89 3704 0044 0532 0130 00';
  const holder = data.account_holder || (project?.partner1_name && project?.partner2_name ? `${project.partner1_name} & ${project.partner2_name}` : 'Emma & Noah');
  const bank = data.bank_name || 'Commerzbank';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Aufmerksamkeit</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Description $visible={visible}>{description}</Description>
        <BankCard $visible={visible}>
          <BankRow><BankLabel>Kontoinhaber</BankLabel><BankValue>{holder}</BankValue></BankRow>
          <BankRow><BankLabel>IBAN</BankLabel><BankValue>{iban}</BankValue></BankRow>
          <BankRow><BankLabel>Bank</BankLabel><BankValue>{bank}</BankValue></BankRow>
        </BankCard>
      </Content>
    </SectionWrapper>
  );
}

export default Gifts;
