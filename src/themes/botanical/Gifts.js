import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  overflow: hidden;
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards;`}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  margin-bottom: 1rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

const Description = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-style: italic;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.2s;`}
`;

// Payment Section
const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;`}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
  }
`;

const CardIcon = styled.span`
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const BankInfo = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
`;

const PayButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }
`;

// External Registry Link
const RegistryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto 3rem;
  padding: 1rem 2rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  transition: all 0.3s ease;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.4s;`}

  &:hover {
    background: rgba(255,255,255,0.12);
    transform: translateY(-2px);
  }
`;

// Wishlist Section
const WishlistHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.5s;`}
`;

const WishlistTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 300;
  color: var(--text-light);
`;

const GiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.6s;`}

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
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
  opacity: ${p => p.$reserved ? 0.6 : 1};

  &:hover {
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
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const ReservedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  background: rgba(139, 157, 131, 0.9);
  color: white;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
`;

const GiftContent = styled.div`
  padding: 1.25rem;
`;

const GiftName = styled.h4`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const GiftPrice = styled.div`
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${p => p.$reserved ? 'rgba(255,255,255,0.05)' : 'rgba(139, 157, 131, 0.2)'};
  border: 1px solid ${p => p.$reserved ? 'rgba(255,255,255,0.1)' : 'rgba(139, 157, 131, 0.4)'};
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$reserved ? 'var(--text-dim)' : 'var(--text-light)'};
  cursor: ${p => p.$reserved ? 'default' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${p => p.$reserved ? 'rgba(255,255,255,0.05)' : 'rgba(139, 157, 131, 0.3)'};
  }
`;

const ShopLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--text-muted);
  transition: color 0.3s ease;

  &:hover {
    color: var(--text-light);
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
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
  background: var(--glass-bg);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
`;

const ModalTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-light);
  margin-bottom: 1rem;

  &::placeholder {
    color: var(--text-dim);
  }

  &:focus {
    outline: none;
    border-color: rgba(139, 157, 131, 0.5);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 0.9rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$primary ? css`
    background: rgba(139, 157, 131, 0.3);
    border: 1px solid rgba(139, 157, 131, 0.5);
    color: var(--text-light);

    &:hover {
      background: rgba(139, 157, 131, 0.4);
    }
  ` : css`
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-muted);

    &:hover {
      background: rgba(255,255,255,0.08);
    }
  `}
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};

  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Das schönste Geschenk ist eure Anwesenheit! Wenn ihr uns dennoch etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise.';
  const bankDetails = giftsData.bank_details || '';
  const paypalLink = giftsData.paypal_link || '';
  const showRegistry = giftsData.show_registry;
  const registryUrl = giftsData.registry_url || '';
  const items = giftsData.items || [];

  const { reservations, reserveGiftItem, isItemReserved, loading: reservationsLoading } = useGifts();

  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [reserverName, setReserverName] = useState('');
  const [reserverEmail, setReserverEmail] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

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
    <Section id="gifts" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Von Herzen</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>

        {hasPaymentOptions && (
          <PaymentGrid $visible={visible}>
            {bankDetails && (
              <GlassCard>
                <CardIcon>🏦</CardIcon>
                <CardTitle>Banküberweisung</CardTitle>
                <BankInfo>{bankDetails}</BankInfo>
              </GlassCard>
            )}
            {paypalLink && (
              <GlassCard>
                <CardIcon>💳</CardIcon>
                <CardTitle>PayPal</CardTitle>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Einfach und schnell per PayPal
                </p>
                <PayButton href={paypalLink} target="_blank" rel="noopener noreferrer">
                  Zu PayPal →
                </PayButton>
              </GlassCard>
            )}
          </PaymentGrid>
        )}

        {showRegistry && registryUrl && (
          <div style={{ textAlign: 'center' }}>
            <RegistryLink $visible={visible} href={registryUrl} target="_blank" rel="noopener noreferrer">
              🎁 Zur externen Geschenkeliste →
            </RegistryLink>
          </div>
        )}

        {hasItems && (
          <>
            <WishlistHeader $visible={visible}>
              <WishlistTitle>Unsere Wünsche</WishlistTitle>
            </WishlistHeader>

            <GiftsGrid $visible={visible}>
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
