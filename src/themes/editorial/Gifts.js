import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-light-gray);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const PaymentSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const PaymentCard = styled.div`
  background: var(--editorial-white);
  padding: 2rem;
  text-align: center;
`;

const PaymentIcon = styled.span`
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
`;

const PaymentTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-black);
  margin-bottom: 1rem;
`;

const PaymentDetails = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--editorial-gray);
  line-height: 1.6;
  white-space: pre-line;
`;

const PaymentButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--editorial-black);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--editorial-red);
  }
`;

const RegistryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 3rem;
  padding: 1rem 2rem;
  background: var(--editorial-black);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  opacity: 0;

  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.45s;
  `}

  &:hover {
    background: var(--editorial-red);
  }
`;

const SectionTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin: 1rem 0 2rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.6s;
  `}
`;

const GiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.7s;
  `}
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1.5rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const GiftCard = styled.div`
  background: var(--editorial-white);
  overflow: hidden;
  transition: transform 0.3s ease;
  
  ${p => p.$reserved && css`
    opacity: 0.6;
  `}
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 80vw;
    max-width: 320px;
    scroll-snap-align: start;
  }
`;

const GiftImage = styled.div`
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    display: block;
    padding-top: 75%;
  }
  
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: ${p => p.$reserved ? 'grayscale(100%)' : 'grayscale(20%)'};
    transition: all 0.5s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
`;

const GiftImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  background: var(--editorial-light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const ReservedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: var(--editorial-red);
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const GiftContent = styled.div`
  padding: 1.5rem;
`;

const GiftName = styled.h4`
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: var(--editorial-gray);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const GiftPrice = styled.div`
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--editorial-black);
  margin-bottom: 1rem;
  
  span {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--editorial-gray);
  }
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${p => p.$reserved ? 'var(--editorial-light-gray)' : 'var(--editorial-black)'};
  color: ${p => p.$reserved ? 'var(--editorial-gray)' : 'var(--editorial-white)'};
  border: none;
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: ${p => p.$reserved ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${p => p.$reserved ? 'var(--editorial-light-gray)' : 'var(--editorial-red)'};
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const ExternalLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--editorial-gray);
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--editorial-red);
  }
`;

// Reserve Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  ${p => p.$open && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const ModalContent = styled.div`
  background: var(--editorial-white);
  max-width: 450px;
  width: 100%;
  padding: 2.5rem;
`;

const ModalTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--editorial-gray);
  margin-bottom: 2rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: var(--editorial-light-gray);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$primary ? css`
    background: var(--editorial-black);
    color: var(--editorial-white);
    
    &:hover {
      background: var(--editorial-red);
    }
  ` : css`
    background: var(--editorial-light-gray);
    color: var(--editorial-gray);
    
    &:hover {
      background: #ddd;
    }
  `}
`;

// ============================================
// COMPONENT
// ============================================

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};
  
  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch etwas schenken möchte, findet hier ein paar Ideen.';
  const bankDetails = giftsData.bank_details || '';
  const paypalLink = giftsData.paypal_link || '';
  const showRegistry = giftsData.show_registry;
  const registryUrl = giftsData.registry_url || '';
  const items = giftsData.items || [];
  
  const { reservations, reserveGiftItem } = useGifts();
  
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [reserverName, setReserverName] = useState('');
  const [reserverEmail, setReserverEmail] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  // Keine Default-Einträge - nur Items aus dem Dashboard anzeigen
  const displayItems = items;
  
  const isReserved = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item?.reserved) return true;
    return reservations.some(r => r.item_id === itemId);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleReserveClick = (gift) => {
    setSelectedGift(gift);
    setModalOpen(true);
  };

  const handleReserveSubmit = async () => {
    if (!reserverName.trim()) return;

    const result = await reserveGiftItem(selectedGift.id, reserverName, reserverEmail);
    if (result.success) {
      setModalOpen(false);
      setReserverName('');
      setReserverEmail('');
      setModalState({
        isOpen: true,
        type: 'success',
        message: `"${selectedGift.name || selectedGift.title}" wurde für dich reserviert!`,
      });
    } else {
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Reservierung fehlgeschlagen. Bitte versuche es erneut.',
      });
    }
  };

  return (
    <Section id="gifts" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Wunschliste</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        {(bankDetails || paypalLink) && (
          <PaymentSection $visible={visible}>
            {bankDetails && (
              <PaymentCard>
                <PaymentIcon>🏦</PaymentIcon>
                <PaymentTitle>Banküberweisung</PaymentTitle>
                <PaymentDetails>{bankDetails}</PaymentDetails>
              </PaymentCard>
            )}
            {paypalLink && (
              <PaymentCard>
                <PaymentIcon>💳</PaymentIcon>
                <PaymentTitle>PayPal</PaymentTitle>
                <PaymentDetails>Einfach und schnell per PayPal</PaymentDetails>
                <PaymentButton href={paypalLink} target="_blank" rel="noopener noreferrer">
                  Zu PayPal →
                </PaymentButton>
              </PaymentCard>
            )}
          </PaymentSection>
        )}

        {showRegistry && registryUrl && (
          <div style={{ textAlign: 'center' }}>
            <RegistryLink $visible={visible} href={registryUrl} target="_blank" rel="noopener noreferrer">
              🎁 Zur externen Geschenkeliste →
            </RegistryLink>
          </div>
        )}

        {displayItems.length > 0 && (
          <>
            <SectionTitle $visible={visible}>Unsere Wünsche</SectionTitle>
            <Divider $visible={visible} />
            
            <GiftsGrid $visible={visible}>
              {displayItems.map(gift => {
                const reserved = isReserved(gift.id);
                
                return (
                  <GiftCard key={gift.id} $reserved={reserved}>
                    <GiftImage $reserved={reserved}>
                      {gift.image ? (
                        <img src={gift.image} alt={gift.title || gift.name} loading="lazy" />
                      ) : (
                        <GiftImagePlaceholder>🎁</GiftImagePlaceholder>
                      )}
                      {reserved && <ReservedBadge>Reserviert</ReservedBadge>}
                    </GiftImage>
                    
                    <GiftContent>
                      <GiftName>{gift.title || gift.name}</GiftName>
                      {gift.description && (
                        <GiftDescription>{gift.description}</GiftDescription>
                      )}
                      {(gift.price || gift.cost) && (
                        <GiftPrice>
                          {gift.cost || gift.price}
                          {!gift.cost && gift.price && '€'} <span>ca.</span>
                        </GiftPrice>
                      )}
                      
                      <ReserveButton
                        $reserved={reserved}
                        disabled={reserved}
                        onClick={() => !reserved && handleReserveClick(gift)}
                      >
                        {reserved ? '✓ Reserviert' : 'Reservieren'}
                      </ReserveButton>
                      
                      {gift.link && !reserved && (
                        <ExternalLink href={gift.link} target="_blank" rel="noopener noreferrer">
                          Zum Shop →
                        </ExternalLink>
                      )}
                    </GiftContent>
                  </GiftCard>
                );
              })}
            </GiftsGrid>
          </>
        )}
      </Container>
      
      {/* Reserve Modal */}
      <ModalOverlay $open={modalOpen} onClick={() => setModalOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>Geschenk reservieren</ModalTitle>
          <ModalSubtitle>
            {selectedGift?.name} für das Brautpaar reservieren
          </ModalSubtitle>
          
          <ModalInput
            type="text"
            placeholder="Dein Name *"
            value={reserverName}
            onChange={e => setReserverName(e.target.value)}
          />
          <ModalInput
            type="email"
            placeholder="E-Mail (optional)"
            value={reserverEmail}
            onChange={e => setReserverEmail(e.target.value)}
          />
          
          <ModalButtons>
            <ModalButton onClick={() => setModalOpen(false)}>
              Abbrechen
            </ModalButton>
            <ModalButton $primary onClick={handleReserveSubmit}>
              Reservieren
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </ModalOverlay>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={modalState.type === 'success' ? 3000 : 0}
      />
    </Section>
  );
}

export default Gifts;
