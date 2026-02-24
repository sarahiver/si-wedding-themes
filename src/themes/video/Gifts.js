import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';
import SectionWrapper from './SectionWrapper';
import { optimizedUrl } from '../../lib/cloudinary';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-primary);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--video-accent);
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.1s;
`;

const Description = styled.p`
  font-family: var(--font-accent);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--video-silver);
  line-height: 1.8;
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
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 2rem;
  text-align: center;
`;

const CardIcon = styled.span`
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--video-white);
  margin-bottom: 1rem;
`;

const BankInfo = styled.div`
  font-family: var(--font-primary);
  font-size: 0.85rem;
  color: var(--video-silver);
  line-height: 1.8;
  text-align: left;
  white-space: pre-line;
`;

const PayButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--video-accent);
  color: var(--video-white);
  font-family: var(--font-primary);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    background: var(--video-accent-light);
    transform: translateY(-2px);
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
  border: 1px solid var(--video-accent);
  color: var(--video-accent);
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.4s;

  &:hover {
    background: var(--video-accent);
    color: var(--video-white);
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
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--video-white);
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
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${p => p.$reserved ? 0.6 : 1};

  &:hover {
    border-color: rgba(255,255,255,0.15);
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
  background: rgba(255,255,255,0.03);
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
  background: var(--video-accent);
  color: var(--video-white);
  font-family: var(--font-primary);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const GiftContent = styled.div`
  padding: 1.25rem;
`;

const GiftName = styled.h4`
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--video-white);
  margin-bottom: 0.5rem;
`;

const GiftDescription = styled.p`
  font-family: var(--font-accent);
  font-size: 0.9rem;
  font-style: italic;
  color: var(--video-silver);
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const GiftPrice = styled.div`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--video-white);
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${p => p.$reserved ? 'rgba(255,255,255,0.03)' : 'var(--video-accent)'};
  border: none;
  font-family: var(--font-primary);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.$reserved ? 'var(--video-gray)' : 'var(--video-white)'};
  cursor: ${p => p.$reserved ? 'default' : 'pointer'};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${p => p.$reserved ? 'rgba(255,255,255,0.03)' : 'var(--video-accent-light)'};
  }
`;

const ShopLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-family: var(--font-primary);
  font-size: 0.65rem;
  color: var(--video-gray);
  transition: color 0.3s ease;

  &:hover {
    color: var(--video-accent);
  }
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10,10,10,0.95);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: var(--video-charcoal);
  border: 1px solid rgba(255,255,255,0.1);
  max-width: 400px;
  width: 100%;
  padding: 2rem;
`;

const ModalTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--video-white);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: var(--font-accent);
  font-size: 0.95rem;
  font-style: italic;
  color: var(--video-silver);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--video-white);
  margin-bottom: 1rem;

  &::placeholder {
    color: var(--video-gray);
  }

  &:focus {
    outline: none;
    border-color: var(--video-accent);
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
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  ${p => p.$primary ? css`
    background: var(--video-accent);
    border: none;
    color: var(--video-white);

    &:hover {
      background: var(--video-accent-light);
    }
  ` : css`
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: var(--video-gray);

    &:hover {
      border-color: rgba(255,255,255,0.4);
      color: var(--video-white);
    }
  `}
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};

  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Eure Anwesenheit ist das schönste Geschenk. Wer uns dennoch etwas schenken möchte, kann gerne zu unserer Hochzeitsreise beitragen.';
  const bankDetails = giftsData.bank_details || '';
  const paypalLink = giftsData.paypal_link || '';
  const showRegistry = giftsData.show_registry;
  const registryUrl = giftsData.registry_url || '';
  const items = giftsData.items || [];

  const { reservations, reserveGiftItem, isItemReserved, loading: reservationsLoading } = useGifts();

  const [visible] = useState(true); // SectionWrapper handles fade-in
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
    <SectionWrapper id="gifts">
      <Content>
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
                <p style={{ color: 'var(--video-silver)', fontSize: '0.9rem', marginBottom: '1rem' }}>
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
                const reserved = isItemReserved(gift.id);

                return (
                  <GiftCard key={gift.id} $reserved={reserved}>
                    <GiftImage $reserved={reserved}>
                      {gift.image ? (
                        <img src={optimizedUrl.card(gift.image)} alt={gift.title} loading="lazy" />
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
      </Content>

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
    </SectionWrapper>
  );
}

export default Gifts;
