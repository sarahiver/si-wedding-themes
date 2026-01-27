import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE GIFTS - Gift Registry with Reservation System
// Real gifts that guests can reserve
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const Intro = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--luxe-text-light);
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.8;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-text-light)'};
  background: ${p => p.$active ? 'var(--luxe-white)' : 'transparent'};
  border: 1px solid ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-border)'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const GiftCard = styled.div`
  background: var(--luxe-white);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  ${p => p.$reserved && css`
    &::after {
      content: 'Reserviert';
      position: absolute;
      top: 1rem;
      right: -2rem;
      background: var(--luxe-gold);
      color: white;
      font-family: var(--font-sans);
      font-size: 0.55rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.4rem 2.5rem;
      transform: rotate(45deg);
    }
  `}
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0,0,0,0.06);
  }
`;

const GiftImage = styled.div`
  aspect-ratio: 4/3;
  background-image: url(${p => p.$image});
  background-size: cover;
  background-position: center;
  filter: ${p => p.$reserved ? 'grayscale(50%)' : 'none'};
  transition: filter 0.3s ease;
`;

const GiftContent = styled.div`
  padding: 1.5rem;
`;

const GiftCategory = styled.p`
  font-family: var(--font-sans);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 0.5rem;
`;

const GiftName = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const GiftPrice = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-text);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$reserved ? 'var(--luxe-text-muted)' : 'var(--luxe-text)'};
  background: transparent;
  border: 1px solid ${p => p.$reserved ? 'var(--luxe-border)' : 'var(--luxe-border)'};
  cursor: ${p => p.$reserved ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  ${p => !p.$reserved && css`
    &:hover {
      border-color: var(--luxe-gold);
      color: var(--luxe-gold);
    }
  `}
`;

const MoneySection = styled.div`
  margin-top: 3rem;
  padding: 2.5rem;
  background: var(--luxe-white);
  text-align: center;
`;

const MoneyTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1rem;
`;

const MoneyText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-text-light);
  margin-bottom: 1.5rem;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
`;

const BankDetails = styled.div`
  display: inline-block;
  padding: 1.5rem 2.5rem;
  background: var(--luxe-cream);
  text-align: left;
`;

const BankLine = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text);
  margin-bottom: 0.25rem;
  
  span {
    color: var(--luxe-text-muted);
    display: inline-block;
    width: 100px;
  }
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$isOpen ? 1 : 0};
  visibility: ${p => p.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: var(--luxe-white);
  padding: 2.5rem;
  max-width: 400px;
  width: 100%;
  border: 1px solid var(--luxe-border);
`;

const ModalTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--luxe-text-light);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-text);
  background: var(--luxe-cream);
  border: 1px solid var(--luxe-border);
  margin-bottom: 1rem;
  
  &:focus {
    border-color: var(--luxe-gold);
    outline: none;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 0.9rem;
  font-family: var(--font-sans);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border: 1px solid var(--luxe-border);
  background: ${p => p.$primary ? 'var(--luxe-text-heading)' : 'transparent'};
  color: ${p => p.$primary ? 'white' : 'var(--luxe-text)'};
  cursor: pointer;
  
  &:hover {
    border-color: var(--luxe-gold);
    ${p => !p.$primary && 'color: var(--luxe-gold);'}
  }
`;

function Gifts() {
  const [activeTab, setActiveTab] = useState('all');
  const [gifts, setGifts] = useState([
    { id: 1, name: 'Küchenmaschine', price: '€ 499', category: 'küche', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', reserved: false },
    { id: 2, name: 'Espressomaschine', price: '€ 350', category: 'küche', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', reserved: true },
    { id: 3, name: 'Bettwäsche Set', price: '€ 180', category: 'home', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', reserved: false },
    { id: 4, name: 'Weinkühlschrank', price: '€ 280', category: 'küche', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', reserved: false },
    { id: 5, name: 'Saugroboter', price: '€ 450', category: 'home', image: 'https://images.unsplash.com/photo-1558618047-f4b511ae9eb5?w=500', reserved: true },
    { id: 6, name: 'Dinner für Zwei', price: '€ 200', category: 'erlebnis', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500', reserved: false },
    { id: 7, name: 'Spa Wochenende', price: '€ 400', category: 'erlebnis', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500', reserved: false },
    { id: 8, name: 'Picknick-Set', price: '€ 120', category: 'outdoor', image: 'https://images.unsplash.com/photo-1526915386303-76f42d9e25ea?w=500', reserved: false },
  ]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [guestName, setGuestName] = useState('');
  
  const categories = ['all', 'küche', 'home', 'erlebnis', 'outdoor'];
  const filteredGifts = activeTab === 'all' ? gifts : gifts.filter(g => g.category === activeTab);
  
  const openReserveModal = (gift) => {
    setSelectedGift(gift);
    setModalOpen(true);
  };
  
  const confirmReservation = () => {
    if (!guestName.trim()) return;
    
    setGifts(prev => prev.map(g => 
      g.id === selectedGift.id ? { ...g, reserved: true, reservedBy: guestName } : g
    ));
    
    setModalOpen(false);
    setGuestName('');
    setSelectedGift(null);
  };
  
  return (
    <Section id="gifts">
      <Container>
        <Header>
          <Eyebrow>Geschenke</Eyebrow>
          <Title>Wunschliste</Title>
          <Intro>
            Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch eine Freude machen möchte, 
            findet hier einige Wünsche.
          </Intro>
        </Header>
        
        <Tabs>
          {categories.map(cat => (
            <Tab 
              key={cat} 
              $active={activeTab === cat}
              onClick={() => setActiveTab(cat)}
            >
              {cat === 'all' ? 'Alle' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Tab>
          ))}
        </Tabs>
        
        <GiftGrid>
          {filteredGifts.map(gift => (
            <GiftCard key={gift.id} $reserved={gift.reserved}>
              <GiftImage $image={gift.image} $reserved={gift.reserved} />
              <GiftContent>
                <GiftCategory>{gift.category}</GiftCategory>
                <GiftName>{gift.name}</GiftName>
                <GiftPrice>{gift.price}</GiftPrice>
                <ReserveButton 
                  $reserved={gift.reserved}
                  onClick={() => !gift.reserved && openReserveModal(gift)}
                  disabled={gift.reserved}
                >
                  {gift.reserved ? 'Bereits reserviert' : 'Reservieren'}
                </ReserveButton>
              </GiftContent>
            </GiftCard>
          ))}
        </GiftGrid>
        
        <MoneySection>
          <MoneyTitle>Hochzeitsreise</MoneyTitle>
          <MoneyText>
            Wir träumen von einer Reise nach Japan. Über einen Beitrag 
            zu diesem Abenteuer würden wir uns sehr freuen.
          </MoneyText>
          <BankDetails>
            <BankLine><span>Empfänger:</span> Dave & Kalle</BankLine>
            <BankLine><span>IBAN:</span> DE89 3704 0044 0532 0130 00</BankLine>
            <BankLine><span>Betreff:</span> Hochzeitsreise</BankLine>
          </BankDetails>
        </MoneySection>
      </Container>
      
      <Modal $isOpen={modalOpen} onClick={() => setModalOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>Geschenk reservieren</ModalTitle>
          <ModalSubtitle>
            {selectedGift?.name} · {selectedGift?.price}
          </ModalSubtitle>
          <ModalInput
            type="text"
            placeholder="Euer Name"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
          />
          <ModalButtons>
            <ModalButton onClick={() => setModalOpen(false)}>Abbrechen</ModalButton>
            <ModalButton $primary onClick={confirmReservation}>Reservieren</ModalButton>
          </ModalButtons>
        </ModalContent>
      </Modal>
    </Section>
  );
}

export default Gifts;
