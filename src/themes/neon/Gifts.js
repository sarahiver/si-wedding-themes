import { useWedding } from '../../context/WeddingContext';
// src/components/Gifts.js - Neon Theme
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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
  padding: 150px 5%;
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
  max-width: 900px;
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

const Subtitle = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.5);
  margin-top: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.7;
`;

const MessageBox = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,0,255,0.2);
  padding: 40px;
  margin-bottom: 50px;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 20px;
    left: 30px;
    font-family: 'Space Grotesk', serif;
    font-size: 4rem;
    color: #ff00ff;
    opacity: 0.3;
    line-height: 1;
  }
  
  p {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.1rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.8;
    text-align: center;
    font-style: italic;
  }
`;

const BankSection = styled.div`
  background: linear-gradient(135deg, rgba(0,255,255,0.05), rgba(255,0,255,0.05));
  border: 1px solid rgba(0,255,255,0.2);
  padding: 50px;
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

const BankHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  
  svg {
    width: 30px;
    height: 30px;
    color: #00ffff;
  }
  
  h3 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
  }
`;

const BankDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BankRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(0,255,255,0.1);
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(0,255,255,0.3);
    background: rgba(0,255,255,0.05);
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const BankLabel = styled.div`
  font-family: 'Space Grotesk', monospace;
  font-size: 0.8rem;
  color: #00ffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  min-width: 150px;
`;

const BankValue = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  color: #fff;
  flex: 1;
  text-align: center;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${p => p.$copied ? '#00ff88' : 'rgba(0,255,255,0.3)'};
  color: ${p => p.$copied ? '#00ff88' : '#00ffff'};
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(0,255,255,0.1);
    border-color: #00ffff;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  margin-top: 30px;
  padding: 15px;
  background: rgba(0,255,136,0.1);
  border: 1px solid rgba(0,255,136,0.3);
  color: #00ff88;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  animation: ${pulseGlow} 2s ease-in-out;
  
  &::before {
    content: '✓ ';
  }
`;

const AlternativeSection = styled.div`
  margin-top: 50px;
  text-align: center;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  }
  
  span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }
`;

const WishlistLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 20px 40px;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff);
  background-size: 200% 100%;
  animation: ${shimmerMove} 3s linear infinite;
  color: #0a0a0f;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(255,0,255,0.5);
  }
`;

function Gifts({
  message = 'Das größte Geschenk ist eure Anwesenheit! Aber falls ihr uns trotzdem etwas schenken möchtet, freuen wir uns über einen Beitrag zu unserer Hochzeitsreise oder etwas von unserer Wunschliste.',
  bankDetails = {
    accountHolder: 'Alex & Jordan Smith',
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    bank: 'Commerzbank',
    reference: 'Wedding Alex & Jordan'
  },
  wishlistUrl = null
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setShowSuccess(true);
      setTimeout(() => {
        setCopiedField(null);
        setShowSuccess(false);
      }, 2000);
    });
  };

  const bankRows = [
    { label: 'Kontoinhaber', value: bankDetails.accountHolder, key: 'holder' },
    { label: 'IBAN', value: bankDetails.iban, key: 'iban' },
    { label: 'BIC', value: bankDetails.bic, key: 'bic' },
    { label: 'Bank', value: bankDetails.bank, key: 'bank' },
    { label: 'Verwendungszweck', value: bankDetails.reference, key: 'reference' },
  ];

  return (
    <Section ref={sectionRef} id="gifts">
      <GridBG />
      
      <Container>
        <Header $visible={visible}>
          <GiftIcon>🎁</GiftIcon>
          <Title><span>Geschenke</span></Title>
          <Subtitle>Ein kleiner Guide für alle, die fragen...</Subtitle>
        </Header>
        
        <MessageBox>
          <p>{message}</p>
        </MessageBox>
        
        <BankSection>
          <BankHeader>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.5 1L2 6v2h19V6l-9.5-5zM5 10v8H3v2h18v-2h-2v-8h-2v8h-3v-8h-2v8h-3v-8H5zm-3 12h20v2H2z"/>
            </svg>
            <h3>Bankverbindung</h3>
          </BankHeader>
          
          <BankDetails>
            {bankRows.map((row) => (
              <BankRow key={row.key}>
                <BankLabel>{row.label}</BankLabel>
                <BankValue>{row.value}</BankValue>
                <CopyButton 
                  onClick={() => copyToClipboard(row.value, row.key)}
                  $copied={copiedField === row.key}
                >
                  {copiedField === row.key ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                      </svg>
                      Kopieren
                    </>
                  )}
                </CopyButton>
              </BankRow>
            ))}
          </BankDetails>
          
          {showSuccess && (
            <SuccessMessage>
              In die Zwischenablage kopiert!
            </SuccessMessage>
          )}
        </BankSection>
        
        {wishlistUrl && (
          <AlternativeSection>
            <OrDivider>
              <span>oder</span>
            </OrDivider>
            
            <WishlistLink href={wishlistUrl} target="_blank">
              Zur Wunschliste
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </WishlistLink>
          </AlternativeSection>
        )}
      </Container>
    </Section>
  );
}

export default Gifts;
