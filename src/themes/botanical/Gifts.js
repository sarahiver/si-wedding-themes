import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 800px;
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
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.1s;`}
`;

const GlassCard = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(2rem, 4vw, 3rem);
  text-align: center;
  position: relative;
  overflow: hidden;
  opacity: 0;
  ${p => p.$visible && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.2s;`}
  
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent);
    pointer-events: none;
  }
`;

const Icon = styled.span`
  font-size: 3.5rem;
  display: block;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const BankDetails = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const BankTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const BankInfo = styled.div`
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.8;
  
  strong {
    color: var(--text-light);
    font-weight: 500;
  }
`;

const WishlistLink = styled.a`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.9rem 2rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-light);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-2px);
  }
`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};
  
  const title = giftsData.title || 'Geschenke';
  const message = giftsData.message || 'Das schönste Geschenk ist eure Anwesenheit! Wenn ihr uns dennoch etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise.';
  const bankDetails = giftsData.bank_details || null;
  const wishlistUrl = giftsData.wishlist_url || '';
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="gifts" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Von Herzen</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <GlassCard $visible={visible}>
          <Icon>🎁</Icon>
          <Message>{message}</Message>
          
          {bankDetails && (
            <BankDetails>
              <BankTitle>Bankverbindung</BankTitle>
              <BankInfo>
                {bankDetails.account_holder && <div><strong>Kontoinhaber:</strong> {bankDetails.account_holder}</div>}
                {bankDetails.iban && <div><strong>IBAN:</strong> {bankDetails.iban}</div>}
                {bankDetails.bic && <div><strong>BIC:</strong> {bankDetails.bic}</div>}
                {bankDetails.bank_name && <div><strong>Bank:</strong> {bankDetails.bank_name}</div>}
                {bankDetails.reference && <div><strong>Verwendungszweck:</strong> {bankDetails.reference}</div>}
              </BankInfo>
            </BankDetails>
          )}
          
          {wishlistUrl && (
            <WishlistLink href={wishlistUrl} target="_blank" rel="noopener noreferrer">
              Zur Wunschliste
            </WishlistLink>
          )}
        </GlassCard>
      </Container>
    </Section>
  );
}

export default Gifts;
