// Contemporary Gifts
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--pink);
`;

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--black);
  opacity: 0.7;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: var(--white);
  opacity: 0.9;
  margin: 1rem auto 2rem;
  line-height: 1.6;
`;

const Card = styled.div`
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  text-align: left;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--black);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 2px solid var(--gray-200);
  gap: 1rem;
  
  &:last-child { border-bottom: none; }
  
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--gray-500);
`;

const InfoValue = styled.span`
  font-size: 0.95rem;
  color: var(--black);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CopyButton = styled.button`
  background: var(--yellow);
  border: 2px solid var(--black);
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    background: var(--black);
    color: var(--white);
  }
`;

const PayButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PayButton = styled.a`
  padding: 1rem 2rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--coral);
  color: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-lg);
  }
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};
  
  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist unser schönstes Geschenk! Falls ihr uns dennoch eine Freude machen möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitskasse.';
  const bankDetails = giftsData.bank_details || { holder: 'Max & Sophie', iban: 'DE89 3704 0044 0532 0130 00' };
  const paypalLink = giftsData.paypal_link;

  const copy = (text) => navigator.clipboard.writeText(text.replace(/\s/g, ''));

  return (
    <Section id="gifts">
      <Container>
        <Eyebrow>🎁 Wunschliste</Eyebrow>
        <Title>{title}</Title>
        <Description>{description}</Description>
        
        <Card>
          <CardTitle>💳 Bankverbindung</CardTitle>
          {bankDetails.holder && (
            <InfoRow>
              <InfoLabel>Empfänger</InfoLabel>
              <InfoValue>{bankDetails.holder} <CopyButton onClick={() => copy(bankDetails.holder)}>Copy</CopyButton></InfoValue>
            </InfoRow>
          )}
          {bankDetails.iban && (
            <InfoRow>
              <InfoLabel>IBAN</InfoLabel>
              <InfoValue>{bankDetails.iban} <CopyButton onClick={() => copy(bankDetails.iban)}>Copy</CopyButton></InfoValue>
            </InfoRow>
          )}
          {bankDetails.bic && (
            <InfoRow>
              <InfoLabel>BIC</InfoLabel>
              <InfoValue>{bankDetails.bic}</InfoValue>
            </InfoRow>
          )}
          <InfoRow>
            <InfoLabel>Verwendungszweck</InfoLabel>
            <InfoValue>Hochzeit {bankDetails.holder || 'Sophie & Max'}</InfoValue>
          </InfoRow>
        </Card>
        
        {paypalLink && (
          <PayButtons>
            <PayButton href={paypalLink} target="_blank" rel="noopener noreferrer">
              PayPal →
            </PayButton>
          </PayButtons>
        )}
      </Container>
    </Section>
  );
}

export default Gifts;
