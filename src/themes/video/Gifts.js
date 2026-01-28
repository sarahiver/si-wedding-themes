import { useWedding } from '../../context/WeddingContext';
// src/components/Gifts.js
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 150px 5%;
  background: #FAF8F5;
  position: relative;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const Header = styled.div`
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #B8976A;
  margin-bottom: 25px;

  &::before, &::after {
    content: '—';
    margin: 0 15px;
    color: rgba(184, 151, 106, 0.5);
  }
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 400;
  color: #1A1A1A;

  span {
    font-style: italic;
  }
`;

const Intro = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  font-style: italic;
  color: #666;
  max-width: 650px;
  margin: 30px auto 0;
  line-height: 1.7;
`;

const ContentWrapper = styled.div`
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.8s ease 0.2s;
`;

const GiftCard = styled.div`
  background: #FFFFFF;
  padding: 60px;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.08);
  margin-bottom: 40px;

  @media (max-width: 600px) {
    padding: 40px 25px;
  }
`;

const CardIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 30px;
`;

const CardTitle = styled.h3`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 2rem;
  color: #1A1A1A;
  margin-bottom: 20px;
`;

const CardText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  color: #666;
  max-width: 500px;
  margin: 0 auto 30px;
`;

const BankDetails = styled.div`
  background: #FAF8F5;
  padding: 30px;
  margin-top: 30px;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const BankRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  &:last-child {
    border-bottom: none;
  }
`;

const BankLabel = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #B8976A;
`;

const BankValue = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #1A1A1A;
`;

const AlternativeCard = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const AltOption = styled.div`
  background: #FFFFFF;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
`;

const AltIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const AltTitle = styled.h4`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.4rem;
  color: #1A1A1A;
  margin-bottom: 15px;
`;

const AltText = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.7;
`;

function Gifts() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Header $visible={isVisible}>
          <Eyebrow>Geschenke</Eyebrow>
          <Title>Eure <span>Großzügigkeit</span></Title>
          <Intro>
            Das größte Geschenk ist eure Anwesenheit an unserem besonderen Tag. 
            Falls ihr uns dennoch etwas schenken möchtet...
          </Intro>
        </Header>

        <ContentWrapper $visible={isVisible}>
          <GiftCard>
            <CardIcon>✈️</CardIcon>
            <CardTitle>Flitterwochen-Kasse</CardTitle>
            <CardText>
              Wir träumen von einer Hochzeitsreise nach Japan. Falls ihr dazu beitragen möchtet, 
              freuen wir uns über einen Zuschuss zu unserer Reisekasse.
            </CardText>

            <BankDetails>
              <BankRow>
                <BankLabel>Kontoinhaber</BankLabel>
                <BankValue>Sarah & Max Mustermann</BankValue>
              </BankRow>
              <BankRow>
                <BankLabel>IBAN</BankLabel>
                <BankValue>DE89 3704 0044 0532 0130 00</BankValue>
              </BankRow>
              <BankRow>
                <BankLabel>BIC</BankLabel>
                <BankValue>COBADEFFXXX</BankValue>
              </BankRow>
              <BankRow>
                <BankLabel>Verwendungszweck</BankLabel>
                <BankValue>Hochzeitsgeschenk</BankValue>
              </BankRow>
            </BankDetails>
          </GiftCard>

          <AlternativeCard>
            <AltOption>
              <AltIcon>🎁</AltIcon>
              <AltTitle>Geschenktisch</AltTitle>
              <AltText>
                Ihr möchtet lieber etwas Persönliches schenken? 
                Wir haben einen Geschenktisch bei der Feier aufgestellt.
              </AltText>
            </AltOption>

            <AltOption>
              <AltIcon>💝</AltIcon>
              <AltTitle>Amazon Wunschliste</AltTitle>
              <AltText>
                Für alle, die lieber etwas Konkretes aussuchen möchten, 
                haben wir eine kleine Wunschliste zusammengestellt.
              </AltText>
            </AltOption>
          </AlternativeCard>
        </ContentWrapper>
      </Container>
    </Section>
  );
}

export default Gifts;
