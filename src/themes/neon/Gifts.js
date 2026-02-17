import { useWedding } from '../../context/WeddingContext';
// src/components/Gifts.js - Neon Theme with full features
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const glitchFlicker = keyframes`
  0%, 100% { opacity: 1; }
  92% { opacity: 1; }
  93% { opacity: 0.8; transform: translateX(-1px); }
  94% { opacity: 1; transform: translateX(0); }
  97% { opacity: 0.9; }
`;

const shimmerMove = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,255,255,0.5); }
`;

const Section = styled.section`
  position: relative;
  background: #0a0a0f;
  padding: clamp(4rem, 10vw, 9rem) 5%;
  overflow: hidden;
`;

const GridBG = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const GiftIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 30px;
  animation: ${glitchFlicker} 5s ease-in-out infinite;
`;

const Title = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #fff;

  span {
    color: #00ff88;
    text-shadow: 0 0 20px rgba(0,255,136,0.5);
  }
`;

const Description = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

// Payment Section
const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 50px;
`;

const PaymentCard = styled.div`
  background: linear-gradient(135deg, rgba(0,255,255,0.05), rgba(255,0,255,0.05));
  border: 1px solid rgba(0,255,255,0.2);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00ffff, #ff00ff, #00ff88);
  }
`;

const CardIcon = styled.span`
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
`;

const BankInfo = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.8;
  white-space: pre-line;
`;

const PayButton = styled.a`
  display: block;
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff);
  background-size: 200% 100%;
  animation: ${shimmerMove} 3s linear infinite;
  color: #0a0a0f;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(255,0,255,0.4);
  }
`;

// External Registry
const RegistryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto 50px;
  padding: 20px 40px;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff);
  background-size: 200% 100%;
  animation: ${shimmerMove} 3s linear infinite;
  color: #0a0a0f;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(255,0,255,0.5);
  }
`;

// Wishlist Section
const WishlistHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const WishlistTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  color: #00ffff;
  text-shadow: 0 0 20px rgba(0,255,255,0.3);
`;

const GiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 calc(-1 * var(--section-padding-x, 24px));
    padding: 0 var(--section-padding-x, 24px);
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const GiftCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$reserved ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,255,0.2)'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${p => p.$reserved ? 0.6 : 1};

  &:hover {
    border-color: rgba(255,0,255,0.4);
    box-shadow: 0 0 30px rgba(255,0,255,0.2);
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    flex: 0 0 80vw;
    max-width: 80vw;
    scroll-snap-align: center;
  }
`;

const GiftImage = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: ${p => p.$reserved ? 'grayscale(100%)' : 'none'};
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const GiftPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0,255,255,0.05);
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
  background: #ff00ff;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const GiftContent = styled.div`
  padding: 1.25rem;
`;

const GiftName = styled.h4`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const GiftPrice = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #00ff88;
  text-shadow: 0 0 10px rgba(0,255,136,0.3);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: ${p => p.$reserved ? 'rgba(255,255,255,0.05)' : 'transparent'};
  border: 1px solid ${p => p.$reserved ? 'rgba(255,255,255,0.1)' : '#00ffff'};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${p => p.$reserved ? 'rgba(255,255,255,0.3)' : '#00ffff'};
  cursor: ${p => p.$reserved ? 'default' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${p => p.$reserved ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,255,0.1)'};
    box-shadow: ${p => p.$reserved ? 'none' : '0 0 20px rgba(0,255,255,0.3)'};
  }
`;

const ShopLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  transition: color 0.3s ease;

  &:hover {
    color: #ff00ff;
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10,10,15,0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: #0a0a0f;
  border: 1px solid rgba(0,255,255,0.3);
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00ffff, #ff00ff);
  }
`;

const ModalTitle = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(0,255,255,0.2);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 1rem;

  &::placeholder {
    color: rgba(255,255,255,0.3);
  }

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0,255,255,0.2);
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
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$primary ? css`
    background: #00ffff;
    border: none;
    color: #0a0a0f;

    &:hover {
      background: #ff00ff;
      box-shadow: 0 0 20px rgba(255,0,255,0.4);
    }
  ` : css`
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.5);

    &:hover {
      border-color: rgba(255,255,255,0.4);
      color: #fff;
    }
  `}
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};

  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Das größte Geschenk ist eure Anwesenheit! Aber falls ihr uns trotzdem etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise.';
  const bankDetails = giftsData.bank_details || '';
  const paypalLink = giftsData.paypal_link || '';
  const showRegistry = giftsData.show_registry;
  const registryUrl = giftsData.registry_url || '';
  const items = giftsData.items || [];

  const { reservations, reserveGiftItem, isItemReserved, loading: reservationsLoading } = useGifts();

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [reserverName, setReserverName] = useState('');
  const [reserverEmail, setReserverEmail] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
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
        message: `"${selectedGift.title}" wurde für dich reserviert!`,
      });
    } else {
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Reservierung fehlgeschlagen. Bitte versuche es erneut.',
      });
    }
  };

  const hasPaymentOptions = bankDetails || paypalLink;
  const hasItems = items.length > 0;

  return (
    <Section ref={sectionRef} id="gifts">
      <GridBG />

      <Container>
        <Header $visible={visible}>
          <GiftIcon>🎁</GiftIcon>
          <Title><span>{title}</span></Title>
          <Description>{description}</Description>
        </Header>

        {hasPaymentOptions && (
          <PaymentGrid>
            {bankDetails && (
              <PaymentCard>
                <CardIcon>🏦</CardIcon>
                <CardTitle>Banküberweisung</CardTitle>
                <BankInfo>{bankDetails}</BankInfo>
              </PaymentCard>
            )}
            {paypalLink && (
              <PaymentCard>
                <CardIcon>💳</CardIcon>
                <CardTitle>PayPal</CardTitle>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>
                  Einfach und schnell per PayPal
                </p>
                <PayButton href={paypalLink} target="_blank" rel="noopener noreferrer">
                  Zu PayPal →
                </PayButton>
              </PaymentCard>
            )}
          </PaymentGrid>
        )}

        {showRegistry && registryUrl && (
          <div style={{ textAlign: 'center' }}>
            <RegistryLink href={registryUrl} target="_blank" rel="noopener noreferrer">
              🎁 Zur externen Geschenkeliste →
            </RegistryLink>
          </div>
        )}

        {hasItems && (
          <>
            <WishlistHeader>
              <WishlistTitle>Unsere Wünsche</WishlistTitle>
            </WishlistHeader>

            <GiftsGrid>
              {items.map(gift => {
                const reserved = isItemReserved(gift.id);

                return (
                  <GiftCard key={gift.id} $reserved={reserved}>
                    <GiftImage $reserved={reserved}>
                      {gift.image ? (
                        <img src={gift.image} alt={gift.title} loading="lazy" />
                      ) : (
                        <GiftPlaceholder>🎁</GiftPlaceholder>
                      )}
                      {reserved && <ReservedBadge>Reserviert</ReservedBadge>}
                    </GiftImage>

                    <GiftContent>
                      <GiftName>{gift.title}</GiftName>
                      {gift.description && <GiftDescription>{gift.description}</GiftDescription>}
                      {gift.cost && <GiftPrice>{gift.cost}</GiftPrice>}

                      <ReserveButton
                        $reserved={reserved}
                        disabled={reserved}
                        onClick={() => !reserved && handleReserveClick(gift)}
                      >
                        {reserved ? '✓ Reserviert' : 'Reservieren'}
                      </ReserveButton>

                      {gift.link && !reserved && (
                        <ShopLink href={gift.link} target="_blank" rel="noopener noreferrer">
                          Zum Shop →
                        </ShopLink>
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
          <ModalSubtitle>{selectedGift?.title} für das Brautpaar reservieren</ModalSubtitle>

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
            <ModalButton onClick={() => setModalOpen(false)}>Abbrechen</ModalButton>
            <ModalButton $primary onClick={handleReserveSubmit}>Reservieren</ModalButton>
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
