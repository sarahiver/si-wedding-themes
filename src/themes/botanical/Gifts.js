// Botanical Gifts - Nature-Inspired Gift Registry
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: var(--bg-cream);
  position: relative;
  overflow: hidden;
`;

const DecoLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '100px'};
  height: ${p => p.$size || '100px'};
  background: ${p => p.$color || 'var(--green-mint)'};
  opacity: ${p => p.$opacity || 0.08};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-narrow);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-fern);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--green-forest);
`;

const MainCard = styled.div`
  background: var(--bg-fog);
  padding: clamp(2rem, 6vw, 3rem);
  border-radius: 40px;
  box-shadow: var(--shadow-soft);
  text-align: center;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-medium);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 2rem;
`;

const BankCard = styled.div`
  background: var(--bg-cream);
  padding: 2rem;
  border-radius: 30px;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-soft);
`;

const BankLabel = styled.p`
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--green-fern);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

const BankValue = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--text-dark);
  font-weight: 500;
`;

const IBANValue = styled.p`
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
  word-break: break-all;
`;

const CopyButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--green-mint);
  color: var(--green-forest);
  border: none;
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s var(--ease-nature);
  
  &:hover {
    background: var(--green-sage);
    transform: translateY(-2px);
  }
`;

const PayPalButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--green-fern) 0%, var(--green-forest) 100%);
  color: var(--bg-cream);
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  box-shadow: var(--shadow-medium);
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-deep);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  
  &::before, &::after {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--bg-moss);
  }
`;

const CopyMessage = styled.span`
  color: var(--green-fern);
  font-size: 0.85rem;
  margin-left: 0.5rem;
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};
  
  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist unser schönstes Geschenk! Falls ihr uns dennoch eine Freude machen möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise.';
  const bankDetails = giftsData.bank_details || { holder: 'Emma & Oliver', iban: 'DE89 3704 0044 0532 0130 00' };
  const paypalLink = giftsData.paypal_link;

  const [copied, setCopied] = useState(false);

  const copyIBAN = () => {
    navigator.clipboard.writeText(bankDetails.iban?.replace(/\s/g, '') || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="gifts">
      <DecoLeaf $size="150px" $color="var(--green-mint)" $opacity={0.06} style={{ top: '10%', right: '-4%' }} />
      <DecoLeaf $size="100px" $color="var(--green-sage)" $opacity={0.05} style={{ bottom: '15%', left: '-3%' }} $duration="12s" />
      
      <Container>
        <Header>
          <Eyebrow>🎁 Für uns</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <MainCard>
          <Description>{description}</Description>
          
          {bankDetails && (
            <BankCard>
              <BankLabel>Kontoinhaber</BankLabel>
              <BankValue>{bankDetails.holder}</BankValue>
              
              <div style={{ marginTop: '1rem' }}>
                <BankLabel>IBAN</BankLabel>
                <IBANValue>{bankDetails.iban}</IBANValue>
              </div>
              
              <CopyButton onClick={copyIBAN}>
                📋 IBAN kopieren
                {copied && <CopyMessage>✓ Kopiert!</CopyMessage>}
              </CopyButton>
            </BankCard>
          )}
          
          {paypalLink && (
            <>
              <Divider>oder</Divider>
              <PayPalButton href={paypalLink} target="_blank" rel="noopener noreferrer">
                💳 Per PayPal
              </PayPalButton>
            </>
          )}
        </MainCard>
      </Container>
    </Section>
  );
}

export default Gifts;
