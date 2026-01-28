import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
  position: relative;
  overflow: hidden;
`;

const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  opacity: 0.08;
  animation: ${sway} 6s ease-in-out infinite;
  pointer-events: none;
  svg { width: 100%; height: 100%; fill: var(--sage); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
`;

/* Bank Details Card */
const InfoCard = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--sage-light);
  margin-bottom: 2rem;
  text-align: center;
`;

const InfoCardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--forest);
  margin-bottom: 1rem;
`;

const InfoCardText = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.8;
  white-space: pre-line;
`;

const PaymentButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PaymentButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  background: ${p => p.$primary ? 'var(--sage)' : 'white'};
  color: ${p => p.$primary ? 'white' : 'var(--forest)'};
  border: 1px solid var(--sage);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

/* Gift Registry */
const RegistrySection = styled.div`
  margin-top: 3rem;
`;

const RegistryTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  text-align: center;
  margin-bottom: 2rem;
`;

const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const GiftCard = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--sage-light);
  transition: all 0.3s ease;
  opacity: ${p => p.$reserved ? 0.7 : 1};
  
  &:hover {
    transform: ${p => p.$reserved ? 'none' : 'translateY(-4px)'};
    box-shadow: ${p => p.$reserved ? 'none' : '0 8px 24px rgba(0,0,0,0.1)'};
  }
`;

const GiftImage = styled.div`
  height: 160px;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'linear-gradient(135deg, var(--cream), var(--sage-muted))'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  .placeholder {
    font-size: 3rem;
    opacity: 0.3;
  }
`;

const ReservedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--forest);
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
`;

const GiftContent = styled.div`
  padding: 1.5rem;
`;

const GiftName = styled.h4`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const GiftPrice = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sage);
  margin-bottom: 0.75rem;
`;

const GiftDescription = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.75rem;
  background: ${p => p.$reserved ? 'var(--cream-dark)' : 'var(--sage)'};
  color: ${p => p.$reserved ? 'var(--text-muted)' : 'white'};
  border: none;
  border-radius: 8px;
  cursor: ${p => p.$reserved ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--sage-dark);
  }
`;

/* Reservation Modal */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const Modal = styled.div`
  background: var(--cream);
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  transform: ${p => p.$open ? 'scale(1)' : 'scale(0.9)'};
  transition: transform 0.3s ease;
`;

const ModalTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--forest);
  margin-bottom: 0.5rem;
`;

const ModalSubtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
`;

const ModalInput = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ModalButton = styled.button`
  flex: 1;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${p => p.$primary ? `
    background: var(--sage);
    color: white;
    border: none;
    &:hover:not(:disabled) { background: var(--sage-dark); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  ` : `
    background: white;
    color: var(--forest);
    border: 1px solid var(--sage-light);
    &:hover { border-color: var(--sage); }
  `}
`;

const ErrorMessage = styled.p`
  color: #c0392b;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(192, 57, 43, 0.1);
  border-radius: 6px;
`;

const LeafSVG = () => (
  <svg viewBox="0 0 100 100">
    <path d="M50 5 C20 25 10 60 50 95 C90 60 80 25 50 5 Z" />
  </svg>
);

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};

  const [visible, setVisible] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  const {
    items,
    loading,
    submitting,
    error,
    success,
    formData,
    selectedItem,
    bankDetails,
    paypalLink,
    registryUrl,
    stats,
    updateField,
    reserve,
    openReservationModal,
    closeReservationModal,
  } = useGifts();

  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch etwas schenken möchte, findet hier einige Ideen.';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Show success modal
  useEffect(() => {
    if (success) {
      closeReservationModal();
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Vielen Dank! Das Geschenk wurde für euch reserviert.',
      });
    }
  }, [success]);

  const handleReserve = async () => {
    if (!selectedItem) return;
    await reserve(selectedItem.id);
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <Section ref={sectionRef} id="gifts">
      <FloatingLeaf $size={80} style={{ top: '10%', left: '5%' }}><LeafSVG /></FloatingLeaf>
      <FloatingLeaf $size={60} style={{ bottom: '20%', right: '8%' }}><LeafSVG /></FloatingLeaf>
      
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Von Herzen</Eyebrow>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>
        
        {/* Bank Details / PayPal */}
        {(bankDetails || paypalLink) && (
          <InfoCard>
            <InfoCardTitle>💝 Geldgeschenke</InfoCardTitle>
            {bankDetails && <InfoCardText>{bankDetails}</InfoCardText>}
            <PaymentButtons>
              {paypalLink && (
                <PaymentButton href={paypalLink} target="_blank" $primary>
                  💳 PayPal
                </PaymentButton>
              )}
              {registryUrl && (
                <PaymentButton href={registryUrl} target="_blank">
                  🎁 Zur Wunschliste
                </PaymentButton>
              )}
            </PaymentButtons>
          </InfoCard>
        )}
        
        {/* Gift Registry */}
        {items.length > 0 && (
          <RegistrySection>
            <RegistryTitle>Unsere Wunschliste</RegistryTitle>
            
            <GiftGrid>
              {items.map((item) => (
                <GiftCard key={item.id} $reserved={item.isReserved}>
                  <GiftImage $image={item.image}>
                    {!item.image && <span className="placeholder">🎁</span>}
                    {item.isReserved && <ReservedBadge>Reserviert</ReservedBadge>}
                  </GiftImage>
                  <GiftContent>
                    <GiftName>{item.name}</GiftName>
                    {item.price && <GiftPrice>{formatPrice(item.price)}</GiftPrice>}
                    {item.description && <GiftDescription>{item.description}</GiftDescription>}
                    <ReserveButton 
                      $reserved={item.isReserved}
                      onClick={() => !item.isReserved && openReservationModal(item)}
                      disabled={item.isReserved}
                    >
                      {item.isReserved ? 'Bereits reserviert' : 'Reservieren'}
                    </ReserveButton>
                  </GiftContent>
                </GiftCard>
              ))}
            </GiftGrid>
          </RegistrySection>
        )}
      </Container>
      
      {/* Reservation Modal */}
      <ModalOverlay $open={!!selectedItem} onClick={closeReservationModal}>
        <Modal $open={!!selectedItem} onClick={e => e.stopPropagation()}>
          <ModalTitle>Geschenk reservieren</ModalTitle>
          <ModalSubtitle>
            {selectedItem?.name} {selectedItem?.price && `(${formatPrice(selectedItem.price)})`}
          </ModalSubtitle>
          
          <ModalInput
            type="text"
            placeholder="Euer Name *"
            value={formData.reservedBy}
            onChange={e => updateField('reservedBy', e.target.value)}
          />
          
          <ModalInput
            type="email"
            placeholder="E-Mail (optional)"
            value={formData.email}
            onChange={e => updateField('email', e.target.value)}
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ModalButtons>
            <ModalButton onClick={closeReservationModal}>
              Abbrechen
            </ModalButton>
            <ModalButton $primary onClick={handleReserve} disabled={submitting}>
              {submitting ? 'Wird reserviert...' : 'Reservieren'}
            </ModalButton>
          </ModalButtons>
        </Modal>
      </ModalOverlay>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={3000}
      />
    </Section>
  );
}

export default Gifts;
