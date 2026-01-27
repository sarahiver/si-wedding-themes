import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* ═══════════════════════════════════════════════════════════════════════════
   GIFTS - BOTANICAL THEME
   Geschenke zum Reservieren - Gäste können Geschenke auswählen und reservieren
   ═══════════════════════════════════════════════════════════════════════════ */

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Section = styled.section`
  min-height: 100vh;
  background: linear-gradient(180deg, var(--sage-lightest) 0%, var(--cream) 50%, var(--sage-lightest) 100%);
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
`;

const FloatingElement = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2rem'};
  opacity: 0.12;
  animation: ${float} ${p => p.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  top: ${p => p.$top};
  left: ${p => p.$left};
  right: ${p => p.$right};
  bottom: ${p => p.$bottom};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const GiftIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
`;

const Eyebrow = styled.span`
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--sage);
  display: block;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1.5rem;
  
  span {
    font-style: italic;
    color: var(--sage);
  }
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.8s ease;
  transition-delay: 0.1s;
`;

const FilterTab = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border: 2px solid ${p => p.$active ? 'var(--sage)' : 'rgba(139, 157, 131, 0.3)'};
  border-radius: 50px;
  background: ${p => p.$active ? 'var(--sage)' : 'transparent'};
  color: ${p => p.$active ? 'white' : 'var(--sage-dark)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--sage);
    background: ${p => p.$active ? 'var(--sage-dark)' : 'rgba(139, 157, 131, 0.1)'};
  }
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const GiftCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  overflow: hidden;
  border: 1px solid rgba(139, 157, 131, 0.2);
  box-shadow: 0 15px 50px rgba(139, 157, 131, 0.1);
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '40px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$delay || '0.2s'};
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 70px rgba(139, 157, 131, 0.18);
  }
  
  ${p => p.$reserved && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.7);
      pointer-events: none;
    }
  `}
`;

const GiftImageContainer = styled.div`
  height: 180px;
  background: linear-gradient(135deg, var(--sage-lightest) 0%, var(--cream) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  position: relative;
`;

const ReservedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--sage-dark);
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  z-index: 5;
`;

const PriceBadge = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: white;
  color: var(--forest);
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const GiftContent = styled.div`
  padding: 1.5rem;
`;

const GiftCategory = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--sage);
  margin-bottom: 0.5rem;
`;

const GiftName = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  margin-bottom: 0.75rem;
`;

const GiftDescription = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  background: ${p => p.$reserved ? 'var(--text-muted)' : 'var(--sage)'};
  color: white;
  
  &:hover:not(:disabled) {
    background: var(--sage-dark);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(139, 157, 131, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
  }
`;

const ReservedBy = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 0.75rem;
  font-style: italic;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: ${fadeInUp} 0.3s ease;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 30px;
  padding: 3rem;
  max-width: 450px;
  width: 100%;
  text-align: center;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.2);
`;

const ModalIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
`;

const ModalInput = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(139, 157, 131, 0.2);
  border-radius: 15px;
  background: var(--cream);
  color: var(--forest);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    background: white;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModalButton = styled.button`
  flex: 1;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$primary ? `
    background: var(--sage);
    color: white;
    border: none;
    
    &:hover {
      background: var(--sage-dark);
    }
  ` : `
    background: transparent;
    color: var(--text-light);
    border: 2px solid rgba(139, 157, 131, 0.3);
    
    &:hover {
      border-color: var(--sage);
      color: var(--sage);
    }
  `}
`;

const SuccessModal = styled(ModalContent)`
  background: linear-gradient(135deg, var(--sage-lightest) 0%, white 100%);
`;

const InfoSection = styled.div`
  margin-top: 4rem;
  text-align: center;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
  transition-delay: 0.6s;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 25px;
  padding: 2.5rem;
  border: 1px solid rgba(139, 157, 131, 0.15);
  max-width: 700px;
  margin: 0 auto;
`;

const InfoTitle = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.8;
`;

const Gifts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedGift, setSelectedGift] = useState(null);
  const [reserverName, setReserverName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const sectionRef = useRef(null);

  // Geschenkliste
  const [gifts, setGifts] = useState([
    {
      id: 1,
      name: 'KitchenAid Artisan',
      category: 'Küche',
      description: 'Die legendäre Küchenmaschine in Sage Green – perfekt für unsere gemeinsamen Backabende!',
      price: '599€',
      icon: '🎂',
      reserved: false,
      reservedBy: null
    },
    {
      id: 2,
      name: 'Dyson V15',
      category: 'Haushalt',
      description: 'Der smarte Staubsauger für unser neues Zuhause.',
      price: '649€',
      icon: '🏠',
      reserved: true,
      reservedBy: 'Familie Müller'
    },
    {
      id: 3,
      name: 'Espressomaschine',
      category: 'Küche',
      description: 'Für den perfekten Morgenkaffee – eine Sage Barista Express.',
      price: '549€',
      icon: '☕',
      reserved: false,
      reservedBy: null
    },
    {
      id: 4,
      name: 'Camping-Set',
      category: 'Freizeit',
      description: 'Zelt, Schlafsäcke und Campingausrüstung für Abenteuer zu zweit.',
      price: '450€',
      icon: '⛺',
      reserved: false,
      reservedBy: null
    },
    {
      id: 5,
      name: 'Weinkühlschrank',
      category: 'Küche',
      description: 'Für unsere wachsende Weinsammlung – 24 Flaschen Kapazität.',
      price: '379€',
      icon: '🍷',
      reserved: false,
      reservedBy: null
    },
    {
      id: 6,
      name: 'Bettwäsche-Set Luxus',
      category: 'Schlafzimmer',
      description: 'Hochwertige Bettwäsche aus ägyptischer Baumwolle.',
      price: '289€',
      icon: '🛏️',
      reserved: true,
      reservedBy: 'Oma Helga'
    },
    {
      id: 7,
      name: 'Smart TV 65"',
      category: 'Wohnzimmer',
      description: 'Samsung OLED für gemütliche Filmabende.',
      price: '1.299€',
      icon: '📺',
      reserved: false,
      reservedBy: null
    },
    {
      id: 8,
      name: 'Gartenmöbel-Set',
      category: 'Garten',
      description: 'Lounge-Set für unsere zukünftige Terrasse.',
      price: '799€',
      icon: '🌳',
      reserved: false,
      reservedBy: null
    },
    {
      id: 9,
      name: 'Handtücher-Set',
      category: 'Bad',
      description: 'Flauschiges Premium-Set in verschiedenen Größen.',
      price: '149€',
      icon: '🛁',
      reserved: false,
      reservedBy: null
    },
    {
      id: 10,
      name: 'Picknickkorb Deluxe',
      category: 'Freizeit',
      description: 'Vollständig ausgestatteter Korb für romantische Ausflüge.',
      price: '129€',
      icon: '🧺',
      reserved: false,
      reservedBy: null
    },
    {
      id: 11,
      name: 'Kochbuch-Sammlung',
      category: 'Küche',
      description: '5 ausgewählte Kochbücher von unseren Lieblingsköchen.',
      price: '120€',
      icon: '📚',
      reserved: false,
      reservedBy: null
    },
    {
      id: 12,
      name: 'Blumen-Abo (1 Jahr)',
      category: 'Dekoration',
      description: 'Jeden Monat frische Blumen für unser Zuhause.',
      price: '360€',
      icon: '💐',
      reserved: false,
      reservedBy: null
    }
  ]);

  const categories = ['all', ...new Set(gifts.map(g => g.category))];

  const filteredGifts = activeFilter === 'all' 
    ? gifts 
    : gifts.filter(g => g.category === activeFilter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleReserve = () => {
    if (!reserverName.trim()) return;
    
    setGifts(prev => prev.map(gift => 
      gift.id === selectedGift.id 
        ? { ...gift, reserved: true, reservedBy: reserverName }
        : gift
    ));
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedGift(null);
      setReserverName('');
    }, 3000);
  };

  return (
    <Section ref={sectionRef} id="gifts">
      <FloatingElement $top="5%" $left="5%" $size="2.5rem" $duration="7s">🎁</FloatingElement>
      <FloatingElement $top="20%" $right="8%" $size="2rem" $duration="5s" $delay="1s">🌿</FloatingElement>
      <FloatingElement $top="50%" $left="3%" $size="2rem" $duration="8s" $delay="2s">✨</FloatingElement>
      <FloatingElement $bottom="15%" $right="5%" $size="2.5rem" $duration="6s" $delay="0.5s">💚</FloatingElement>

      <Container>
        <Header $visible={isVisible}>
          <GiftIcon>🎁</GiftIcon>
          <Eyebrow>Eure Großzügigkeit</Eyebrow>
          <Title>Geschenke<span>liste</span></Title>
          <Subtitle>
            Das größte Geschenk ist eure Anwesenheit! Wer uns dennoch etwas schenken möchte, 
            findet hier einige Wünsche, die ihr reservieren könnt.
          </Subtitle>
        </Header>

        <FilterTabs $visible={isVisible}>
          {categories.map(cat => (
            <FilterTab 
              key={cat}
              $active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            >
              {cat === 'all' ? 'Alle' : cat}
            </FilterTab>
          ))}
        </FilterTabs>

        <GiftGrid>
          {filteredGifts.map((gift, index) => (
            <GiftCard 
              key={gift.id} 
              $visible={isVisible} 
              $delay={`${0.2 + index * 0.05}s`}
              $reserved={gift.reserved}
            >
              <GiftImageContainer>
                {gift.icon}
                {gift.reserved && <ReservedBadge>Reserviert</ReservedBadge>}
                <PriceBadge>{gift.price}</PriceBadge>
              </GiftImageContainer>
              <GiftContent>
                <GiftCategory>{gift.category}</GiftCategory>
                <GiftName>{gift.name}</GiftName>
                <GiftDescription>{gift.description}</GiftDescription>
                <ReserveButton 
                  $reserved={gift.reserved}
                  disabled={gift.reserved}
                  onClick={() => !gift.reserved && setSelectedGift(gift)}
                >
                  {gift.reserved ? '✓ Bereits reserviert' : '🎁 Reservieren'}
                </ReserveButton>
                {gift.reserved && gift.reservedBy && (
                  <ReservedBy>von {gift.reservedBy}</ReservedBy>
                )}
              </GiftContent>
            </GiftCard>
          ))}
        </GiftGrid>

        <InfoSection $visible={isVisible}>
          <InfoCard>
            <InfoTitle>💝 Hinweis</InfoTitle>
            <InfoText>
              Die Reservierung ist unverbindlich und dient nur zur Abstimmung unter den Gästen. 
              Falls ihr lieber einen Geldumschlag oder etwas ganz anderes schenken möchtet – 
              wir freuen uns über jede Geste von Herzen!
            </InfoText>
          </InfoCard>
        </InfoSection>
      </Container>

      {/* Reservation Modal */}
      {selectedGift && !showSuccess && (
        <Modal onClick={() => setSelectedGift(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalIcon>{selectedGift.icon}</ModalIcon>
            <ModalTitle>{selectedGift.name}</ModalTitle>
            <ModalSubtitle>
              Möchtest du dieses Geschenk reservieren?<br />
              ({selectedGift.price})
            </ModalSubtitle>
            <ModalInput
              type="text"
              placeholder="Euer Name"
              value={reserverName}
              onChange={e => setReserverName(e.target.value)}
              autoFocus
            />
            <ModalButtons>
              <ModalButton onClick={() => setSelectedGift(null)}>
                Abbrechen
              </ModalButton>
              <ModalButton $primary onClick={handleReserve}>
                Reservieren
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <Modal>
          <SuccessModal>
            <ModalIcon>🎉</ModalIcon>
            <ModalTitle>Vielen Dank!</ModalTitle>
            <ModalSubtitle>
              Das Geschenk wurde erfolgreich für euch reserviert.<br />
              Wir freuen uns riesig!
            </ModalSubtitle>
          </SuccessModal>
        </Modal>
      )}
    </Section>
  );
};

export default Gifts;
