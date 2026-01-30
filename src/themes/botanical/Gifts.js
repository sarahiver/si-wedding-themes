import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 450px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: var(--zen-text-light);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const BankCard = styled.div`
  background: var(--zen-bg);
  padding: 2rem;
  text-align: left;
  border: 1px solid var(--zen-line);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.2s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Label = styled.p`
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--zen-text-muted);
  margin-bottom: 0.3rem;
`;

const Value = styled.p`
  font-size: 0.95rem;
  color: var(--zen-text);
  margin-bottom: 1.25rem;
  &:last-child { margin-bottom: 0; }
`;

const IBAN = styled.p`
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--zen-text);
  letter-spacing: 0.05em;
`;

const CopyBtn = styled.button`
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--zen-bg);
  background: var(--zen-text);
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover { opacity: 0.8; }
`;

function Gifts() {
  const { content } = useWedding();
  const data = content?.gifts || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const title = data.title || 'Geschenke';
  const description = data.description || 'Eure Anwesenheit ist das schönste Geschenk. Wer uns darüber hinaus etwas schenken möchte:';
  const bank = data.bank_details || { holder: 'Anna & Thomas', iban: 'DE89 3704 0044 0532 0130 00' };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(bank.iban?.replace(/\s/g, '') || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="gifts" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        <Description className={visible ? 'visible' : ''}>{description}</Description>
        {bank && (
          <BankCard className={visible ? 'visible' : ''}>
            <Label>Kontoinhaber</Label>
            <Value>{bank.holder}</Value>
            <Label>IBAN</Label>
            <IBAN>{bank.iban}</IBAN>
            {bank.bic && (
              <>
                <Label style={{marginTop: '1rem'}}>BIC</Label>
                <Value style={{marginBottom: 0}}>{bank.bic}</Value>
              </>
            )}
          </BankCard>
        )}
        <CopyBtn onClick={handleCopy}>
          {copied ? 'Kopiert ✓' : 'IBAN kopieren'}
        </CopyBtn>
      </Content>
    </Section>
  );
}

export default Gifts;
