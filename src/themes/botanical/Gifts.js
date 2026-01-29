// Botanical Gifts - Clean gift registry
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest-main);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 450px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-mist);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--cream);
`;

const Card = styled.div`
  background: var(--cream);
  padding: 2rem;
`;

const Description = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
  line-height: 1.7;
  text-align: center;
  margin-bottom: 2rem;
`;

const BankDetails = styled.div`
  background: var(--cream-dark);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const BankLabel = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bark-light);
  margin-bottom: 0.25rem;
`;

const BankValue = styled.p`
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--forest-deep);
`;

const IBANValue = styled.p`
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--forest-deep);
  letter-spacing: 0.05em;
`;

const CopyButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  background: var(--forest-deep);
  color: var(--cream);
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--forest-main);
  }
`;

const CopyMessage = styled.span`
  margin-left: 0.5rem;
  color: var(--gold);
`;

const PayPalButton = styled.a`
  display: block;
  text-align: center;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--gold);
  color: var(--bark-dark);
  transition: background 0.3s ease;
  
  &:hover {
    background: var(--gold-light);
  }
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};
  
  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist das schönste Geschenk. Falls ihr uns dennoch etwas schenken möchtet, freuen wir uns über einen Beitrag zur Hochzeitsreise.';
  const bankDetails = giftsData.bank_details || { holder: 'Anna & Thomas', iban: 'DE89 3704 0044 0532 0130 00' };
  const paypalLink = giftsData.paypal_link;

  const [copied, setCopied] = useState(false);

  const copyIBAN = () => {
    navigator.clipboard.writeText(bankDetails.iban?.replace(/\s/g, '') || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="gifts" data-section="gifts">
      <Content>
        <Header>
          <Eyebrow>Für uns</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        <Card>
          <Description>{description}</Description>
          
          {bankDetails && (
            <BankDetails>
              <BankLabel>Kontoinhaber</BankLabel>
              <BankValue>{bankDetails.holder}</BankValue>
              <div style={{ marginTop: '1rem' }}>
                <BankLabel>IBAN</BankLabel>
                <IBANValue>{bankDetails.iban}</IBANValue>
              </div>
              <CopyButton onClick={copyIBAN}>
                IBAN kopieren{copied && <CopyMessage>✓</CopyMessage>}
              </CopyButton>
            </BankDetails>
          )}
          
          {paypalLink && (
            <PayPalButton href={paypalLink} target="_blank">
              Per PayPal
            </PayPalButton>
          )}
        </Card>
      </Content>
    </Section>
  );
}

export default Gifts;
