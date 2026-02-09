// Contemporary Gifts - Full featured with reservation
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const Section = styled.section`
  overflow: hidden;
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--pink);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
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
  margin: 1rem auto 0;
  line-height: 1.6;
  max-width: 600px;
`;

// Payment Section
const PaymentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  text-align: ${p => p.$center ? 'center' : 'left'};
`;

const CardIcon = styled.span`
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: var(--black);
`;

const BankInfo = styled.div`
  font-size: 0.9rem;
  color: var(--gray-600);
  line-height: 1.8;
  white-space: pre-line;
`;

const PayButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--coral);
  color: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-lg);
  }
`;

// External Registry
const RegistryLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 3rem;
  padding: 1rem 2rem;
  background: var(--yellow);
  color: var(--black);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-lg);
  }
`;

// Wishlist
const WishlistHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const WishlistTitle = styled.h3`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--white);
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
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  transition: all 0.2s ease;
  opacity: ${p => p.$reserved ? 0.7 : 1};

  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: 12px 12px 0 var(--black);
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
  border-bottom: 4px solid var(--black);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: ${p => p.$reserved ? 'grayscale(100%)' : 'none'};
  }
`;

const GiftPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: var(--gray-100);
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
  background: var(--coral);
  color: var(--white);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid var(--black);
`;

const GiftContent = styled.div`
  padding: 1.25rem;
`;

const GiftName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const GiftPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: ${p => p.$reserved ? 'var(--gray-200)' : 'var(--electric)'};
  border: 3px solid var(--black);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${p => p.$reserved ? 'var(--gray-500)' : 'var(--white)'};
  cursor: ${p => p.$reserved ? 'default' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${p => p.$reserved ? 'var(--gray-200)' : 'var(--coral)'};
    transform: ${p => p.$reserved ? 'none' : 'translate(-2px, -2px)'};
    box-shadow: ${p => p.$reserved ? 'none' : 'var(--shadow-md)'};
  }
`;

const ShopLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gray-500);
  transition: color 0.2s ease;

  &:hover {
    color: var(--coral);
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
`;

const Modal = styled.div`
  background: var(--white);
  padding: 2.5rem;
  border: 4px solid var(--black);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-size: 0.95rem;
  color: var(--gray-600);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: var(--gray-100);
  border: 3px solid var(--black);
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    box-shadow: var(--shadow-sm);
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
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 3px solid var(--black);
  cursor: pointer;
  transition: all 0.2s ease;

  ${p => p.$primary ? css`
    background: var(--coral);
    color: var(--white);

    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: var(--shadow-md);
    }
  ` : css`
    background: var(--white);
    color: var(--black);

    &:hover {
      background: var(--gray-100);
    }
  `}
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};

  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist unser schönstes Geschenk! Falls ihr uns dennoch eine Freude machen möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitskasse.';
  const bankDetails = giftsData.bank_details || '';
  const paypalLink = giftsData.paypal_link || '';
  const showRegistry = giftsData.show_registry;
  const registryUrl = giftsData.registry_url || '';
  const items = giftsData.items || [];

  const { reservations, reserveGiftItem, isItemReserved, loading: reservationsLoading } = useGifts();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [reserverName, setReserverName] = useState('');
  const [reserverEmail, setReserverEmail] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });

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
    <Section id="gifts">
      <Container>
        <Header>
          <Eyebrow>🎁 Wunschliste</Eyebrow>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>

        {hasPaymentOptions && (
          <PaymentGrid>
            {bankDetails && (
              <Card>
                <CardIcon>🏦</CardIcon>
                <CardTitle>Bankverbindung</CardTitle>
                <BankInfo>{bankDetails}</BankInfo>
              </Card>
            )}
            {paypalLink && (
              <Card $center>
                <CardIcon>💳</CardIcon>
                <CardTitle>PayPal</CardTitle>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                  Einfach und schnell per PayPal
                </p>
                <PayButton href={paypalLink} target="_blank" rel="noopener noreferrer">
                  PayPal →
                </PayButton>
              </Card>
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
        <Modal onClick={e => e.stopPropagation()}>
          <ModalTitle>🎁 Reservieren</ModalTitle>
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
        </Modal>
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
