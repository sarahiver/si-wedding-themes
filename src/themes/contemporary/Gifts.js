import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--white);
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 1rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: var(--gray-600);
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease 0.2s;
`;

const MainCard = styled.div`
  background: linear-gradient(135deg, var(--coral), var(--purple));
  padding: 3rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-xl);
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.3s;
`;

const MainCardTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const MainCardText = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const IbanBox = styled.div`
  background: rgba(0,0,0,0.2);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const IbanText = styled.div`
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--white);
  letter-spacing: 0.05em;
`;

const CopyButton = styled.button`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--black);
  background: var(--yellow);
  padding: 0.75rem 1.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-sm);
  text-transform: uppercase;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-md);
  }
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const GiftCard = styled.div`
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease ${p => 0.4 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
`;

const GiftImage = styled.div`
  height: 150px;
  background: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
`;

const ReservedBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white);
  background: var(--electric);
  padding: 0.3rem 0.6rem;
  border: 2px solid var(--black);
`;

const GiftContent = styled.div`
  padding: 1.25rem;
`;

const GiftName = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const GiftPrice = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  font-size: 0.8rem;
  font-weight: 700;
  color: ${p => p.$reserved ? 'var(--gray-500)' : 'var(--white)'};
  background: ${p => p.$reserved ? 'var(--gray-200)' : 'var(--coral)'};
  padding: 0.75rem;
  border: 2px solid var(--black);
  text-transform: uppercase;
  cursor: ${p => p.$reserved ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-sm);
  }
`;

function Gifts({ gifts = [] }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  const defaultGifts = [
    { name: 'KitchenAid', price: '€599', emoji: '🍳', reserved: false },
    { name: 'Dyson V15', price: '€699', emoji: '🧹', reserved: true },
    { name: 'Nespresso Vertuo', price: '€199', emoji: '☕', reserved: false },
    { name: 'Le Creuset Set', price: '€399', emoji: '🍲', reserved: false },
  ];

  const items = gifts.length > 0 ? gifts : defaultGifts;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('DE89 3704 0044 0532 0130 00');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section ref={sectionRef} id="gifts">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>🎁 Geschenke</Eyebrow>
          <Title $visible={visible}>Gift Registry</Title>
          <Subtitle $visible={visible}>Euer Beitrag zu unserem nächsten Abenteuer</Subtitle>
        </Header>
        
        <MainCard $visible={visible}>
          <MainCardTitle>🌴 Honeymoon Fund</MainCardTitle>
          <MainCardText>
            Das schönste Geschenk ist eure Anwesenheit! Wer uns trotzdem etwas schenken möchte: 
            Wir träumen von einem Roadtrip durch Neuseeland.
          </MainCardText>
          <IbanBox>
            <IbanText>DE89 3704 0044 0532 0130 00</IbanText>
            <CopyButton onClick={handleCopy}>
              {copied ? '✓ Kopiert!' : 'Kopieren'}
            </CopyButton>
          </IbanBox>
        </MainCard>
        
        <GiftGrid>
          {items.map((gift, i) => (
            <GiftCard key={i} $index={i} $visible={visible}>
              <GiftImage $color={colors[i % colors.length]}>
                {gift.emoji}
                {gift.reserved && <ReservedBadge>Reserviert</ReservedBadge>}
              </GiftImage>
              <GiftContent>
                <GiftName>{gift.name}</GiftName>
                <GiftPrice>{gift.price}</GiftPrice>
                <ReserveButton $reserved={gift.reserved} disabled={gift.reserved}>
                  {gift.reserved ? 'Bereits reserviert' : 'Reservieren'}
                </ReserveButton>
              </GiftContent>
            </GiftCard>
          ))}
        </GiftGrid>
      </Container>
    </Section>
  );
}

export default Gifts;
