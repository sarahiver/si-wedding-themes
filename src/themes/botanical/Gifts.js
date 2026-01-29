// Botanical Gifts - Gift info in hole
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--medium);
  line-height: 1.6;
  margin-bottom: 1rem;
  max-width: 280px;
`;

const BankCard = styled.div`
  background: var(--off-white);
  padding: 1rem;
  width: 100%;
  max-width: 260px;
  text-align: left;
  margin-bottom: 0.75rem;
`;

const BankLabel = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.2rem;
`;

const BankValue = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--dark);
`;

const IBANValue = styled.p`
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--dark);
  letter-spacing: 0.03em;
`;

const CopyBtn = styled.button`
  margin-top: 0.75rem;
  padding: 0.6rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 600;
  background: var(--black);
  color: var(--white);
  border: none;
  cursor: pointer;
  
  &:hover { opacity: 0.8; }
`;

const CopyMsg = styled.span`
  margin-left: 0.5rem;
  font-size: 0.7rem;
  color: var(--medium);
`;

const PayPalBtn = styled.a`
  display: inline-block;
  padding: 0.6rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--off-white);
  color: var(--dark);
  border: 1px solid var(--pale);
  transition: all 0.2s;
  
  &:hover {
    background: var(--pale);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--light);
  font-size: 0.75rem;
  margin: 0.5rem 0;
  
  &::before, &::after {
    content: '';
    width: 30px;
    height: 1px;
    background: var(--pale);
  }
`;

function Gifts() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const giftsData = content?.gifts || {};
  
  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist das schönste Geschenk.';
  const bankDetails = giftsData.bank_details || { holder: 'Anna & Thomas', iban: 'DE89 3704 0044 0532 0130 00' };
  const paypalLink = giftsData.paypal_link;

  const [copied, setCopied] = useState(false);

  const copyIBAN = () => {
    navigator.clipboard.writeText(bankDetails.iban?.replace(/\s/g, '') || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section data-section="gifts">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Für uns</Eyebrow>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        {bankDetails && (
          <BankCard>
            <BankLabel>Kontoinhaber</BankLabel>
            <BankValue>{bankDetails.holder}</BankValue>
            <div style={{ marginTop: '0.5rem' }}>
              <BankLabel>IBAN</BankLabel>
              <IBANValue>{bankDetails.iban}</IBANValue>
            </div>
          </BankCard>
        )}
        
        <CopyBtn onClick={copyIBAN}>
          IBAN kopieren{copied && <CopyMsg>✓</CopyMsg>}
        </CopyBtn>
        
        {paypalLink && (
          <>
            <Divider>oder</Divider>
            <PayPalBtn href={paypalLink} target="_blank">
              PayPal
            </PayPalBtn>
          </>
        )}
      </HoleContent>
    </Section>
  );
}

export default Gifts;
