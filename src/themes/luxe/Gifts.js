import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`
  padding: var(--section-padding-y) var(--section-padding-x);
  background: var(--luxe-cream);
  color: var(--luxe-anthracite);
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
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 300;
  font-style: italic;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.1s;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--luxe-graphite);
  max-width: 600px;
  margin: 0 auto;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;
`;

// Payment Section
const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.3s;
`;

const PaymentCard = styled.div`
  background: var(--luxe-anthracite);
  padding: 2rem;
  text-align: center;
`;

const CardIcon = styled.span`
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  margin-bottom: 1rem;
`;

const BankInfo = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--luxe-slate);
  line-height: 1.8;
  text-align: left;
  white-space: pre-line;
`;

const PayButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--luxe-gold);
  color: var(--luxe-void);
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    background: var(--luxe-champagne);
  }
`;

// External Registry
const RegistryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto 3rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid var(--luxe-gold);
  color: var(--luxe-anthracite);
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.4s;

  &:hover {
    background: var(--luxe-gold);
    color: var(--luxe-void);
  }
`;

// Wishlist
const WishlistHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.5s;
`;

const WishlistTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-anthracite);
`;

const GiftsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.6s;
`;

const GiftCard = styled.div`
  background: var(--luxe-white);
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${p => p.$reserved ? 0.6 : 1};

  &:hover {
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    transform: translateY(-5px);
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
  background: var(--luxe-cream);
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
  background: var(--luxe-gold);
  color: var(--luxe-void);
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const GiftContent = styled.div`
  padding: 1.25rem;
`;

const GiftName = styled.h4`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-anthracite);
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--luxe-graphite);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const GiftPrice = styled.div`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 300;
  color: var(--luxe-anthracite);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${p => p.$reserved ? 'var(--luxe-cream)' : 'var(--luxe-anthracite)'};
  border: none;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${p => p.$reserved ? 'var(--luxe-graphite)' : 'var(--luxe-cream)'};
  cursor: ${p => p.$reserved ? 'default' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${p => p.$reserved ? 'var(--luxe-cream)' : 'var(--luxe-gold)'};
    color: ${p => p.$reserved ? 'var(--luxe-graphite)' : 'var(--luxe-void)'};
  }
`;

const ShopLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--luxe-graphite);
  transition: color 0.3s ease;

  &:hover {
    color: var(--luxe-gold);
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10,10,10,0.9);
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
  background: var(--luxe-cream);
  max-width: 400px;
  width: 100%;
  padding: 2.5rem;
`;

const ModalTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-anthracite);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--luxe-graphite);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: var(--luxe-white);
  border: 1px solid var(--luxe-slate);
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--luxe-anthracite);
  margin-bottom: 1rem;

  &::placeholder {
    color: var(--luxe-graphite);
  }

  &:focus {
    outline: none;
    border-color: var(--luxe-gold);
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
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$primary ? css`
    background: var(--luxe-anthracite);
    border: none;
    color: var(--luxe-cream);

    &:hover {
      background: var(--luxe-gold);
      color: var(--luxe-void);
    }
  ` : css`
    background: transparent;
    border: 1px solid var(--luxe-slate);
    color: var(--luxe-graphite);

    &:hover {
      border-color: var(--luxe-anthracite);
      color: var(--luxe-anthracite);
    }
  `}
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};

  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist das schönste Geschenk. Wer uns dennoch etwas schenken möchte, kann gerne zu unserem Reisefonds beitragen.';
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

  const isReserved = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (item?.reserved) return true;
    return reservations.some(r => r.item_id === itemId);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
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
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Aufmerksamkeit</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>

        {hasPaymentOptions && (
          <PaymentGrid $visible={visible}>
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
                <p style={{ color: 'var(--luxe-slate)', fontSize: '0.85rem', marginBottom: '1rem' }}>
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
                const reserved = isReserved(gift.id);

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
