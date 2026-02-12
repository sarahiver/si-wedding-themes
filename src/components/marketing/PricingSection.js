// src/components/marketing/PricingSection.js
// Erweiterte Pricing Section mit Addons/Zusatzoptionen
// Theme-spezifische Layouts
import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

// ============================================
// PRICING DATA
// ============================================
const PACKAGES = [
  { 
    id: 'starter', 
    name: 'Starter', 
    tagline: 'Alles, was ihr für den Start braucht',
    price: '1.290', 
    duration: '6 Monate',
    features: [
      'Eigene Domain (euer-name.de)',
      'RSVP mit Download',
      '6 Monate Hosting',
      '4 Basis-Komponenten (Hero, Countdown, Love Story, RSVP)',
      'Dateneingabe durch Kunde',
      '1 Revision vorher / 1 nachher'
    ],
    addons: {
      saveTheDate: { price: 150, included: false },
      archiv: { price: 150, included: false },
      qrCode: { price: 35, included: false },
      einladung: { price: 400, included: false },
    },
    cta: 'Starter wählen'
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    tagline: 'Für Paare, die es richtig machen wollen',
    price: '1.490', 
    duration: '8 Monate',
    popular: true,
    features: [
      'Eigene Domain (euer-name.de)',
      'RSVP mit Download',
      '8 Monate Hosting',
      '4 Basis-Komponenten (Hero, Countdown, Love Story, RSVP)',
      '3 zusätzliche Komponenten',
      'Dateneingabe durch Kunde',
      '2 Revisionen vorher / 2 nachher'
    ],
    addons: {
      saveTheDate: { price: 75, included: false },
      archiv: { price: 75, included: false },
      qrCode: { price: 35, included: false },
      einladung: { price: 300, included: false },
    },
    cta: 'Beliebteste Wahl'
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    tagline: 'Das Rundum-Sorglos-Paket. Lehnt euch zurück.',
    price: '1.990', 
    duration: '12 Monate',
    features: [
      'Eigene Domain (euer-name.de)',
      'RSVP mit Download',
      '12 Monate Hosting',
      '4 Basis-Komponenten (Hero, Countdown, Love Story, RSVP)',
      '6 zusätzliche Komponenten',
      'Save the Date Seite (bis 2 Monate)',
      'Archiv-Seite (3 Monate)',
      'Dateneingabe durch S&I.',
      'QR-Code Erstellung',
      'Unbegrenzte Revisionen'
    ],
    addons: {
      saveTheDate: { price: 0, included: true },
      archiv: { price: 0, included: true },
      qrCode: { price: 0, included: true },
      einladung: { price: 200, included: false },
    },
    cta: 'Premium wählen'
  },
];

const ADDONS = [
  { id: 'saveTheDate', name: 'Save the Date Seite', desc: 'Bis 2 Monate vor der Hochzeit' },
  { id: 'archiv', name: 'Archiv-Seite', desc: '3 Monate (Hero, Danke, Galerie, Bilder-Upload)' },
  { id: 'qrCode', name: 'QR-Code Erstellung', desc: 'Für Einladungen' },
  { id: 'einladung', name: 'Einladungs-Design', desc: 'Passend zum Website-Theme' },
];

// ============================================
// BASE STYLES
// ============================================
const Section = styled.section`
  padding: clamp(5rem, 12vh, 10rem) clamp(1.5rem, 5vw, 4rem);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: stretch;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    gap: 2rem;
  }
`;

const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardBottom = styled.div`
  margin-top: auto;
`;

const AddonsSection = styled.div`
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const AddonsTitle = styled.h3`
  margin-bottom: 1.5rem;
`;

const AddonsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// ============================================
// ON REQUEST BOX - Auf Anfrage
// ============================================
const OnRequestBox = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  text-align: center;
  border-radius: 12px;
`;

const OnRequestTitle = styled.h3`
  margin-bottom: 0.75rem;
`;

const OnRequestItems = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const OnRequestNote = styled.p`
  font-style: italic;
`;

// ON REQUEST DATA
const ON_REQUEST_ITEMS = [
  'Mehrsprachigkeit',
  'Individuelles Design',
  'Designanpassungen',
  'Passwortschutz',
];

// ============================================
// EDITORIAL THEME
// ============================================
const EditorialSection = styled(Section)`
  background: #FAFAFA;
`;

const EditorialEyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #C41E3A;
  margin-bottom: 1rem;
`;

const EditorialTitle = styled.h2`
  font-family: 'Oswald', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  color: #0A0A0A;
`;

const EditorialCard = styled.div`
  background: #fff;
  border: ${p => p.$pop ? '2px solid #C41E3A' : '1px solid #E5E5E5'};
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  ${p => p.$pop && css`
    &::before {
      content: 'Empfohlen';
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #C41E3A;
      color: #fff;
      font-family: 'Oswald', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.4rem 1rem;
    }
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
`;

const PkgTagline = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  font-style: italic;
  color: #888;
  margin-bottom: 0.75rem;
  margin-top: -0.25rem;
`;

const EditorialCardName = styled.h3`
  font-family: 'Oswald', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0A0A0A;
  margin-bottom: 0.5rem;
`;

const EditorialCardPrice = styled.div`
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$pop ? '#C41E3A' : '#0A0A0A'};
  margin-bottom: 0.25rem;
  
  span { font-size: 1.2rem; }
`;

const EditorialCardDuration = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 1.5rem;
`;

const EditorialFeatureList = styled.ul`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const EditorialFeature = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #555;
  padding: 0.5rem 0;
  border-bottom: 1px solid #F0F0F0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '✓';
    color: #C41E3A;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const EditorialAddonsTitle = styled(AddonsTitle)`
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0A0A0A;
  letter-spacing: 0.05em;
  margin-top: auto;
  padding-top: 1.5rem;
`;

const EditorialAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${p => p.$included ? 'rgba(196, 30, 58, 0.05)' : '#F5F5F5'};
  border: 1px solid ${p => p.$included ? '#C41E3A' : '#E5E5E5'};
`;

const EditorialAddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EditorialAddonCheck = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${p => p.$included ? '#C41E3A' : '#CCC'};
  background: ${p => p.$included ? '#C41E3A' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #fff;
`;

const EditorialAddonName = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
`;

const EditorialAddonPrice = styled.span`
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${p => p.$included ? '#C41E3A' : '#666'};
`;

const EditorialCTA = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  ${p => p.$pop ? css`
    background: #C41E3A;
    color: #fff;
    &:hover { background: #a01830; }
  ` : css`
    background: transparent;
    color: #0A0A0A;
    border: 2px solid #0A0A0A;
    &:hover { background: #0A0A0A; color: #fff; }
  `}
`;

// ============================================
// BOTANICAL THEME
// ============================================
const BotanicalSection = styled(Section)`
  background: transparent;
  position: relative;
  z-index: 10;
`;

const BotanicalEyebrow = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 1rem;
`;

const BotanicalTitle = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: rgba(255,255,255,0.95);
`;

const BotanicalCard = styled.div`
  background: rgba(255,255,255,${p => p.$pop ? '0.1' : '0.06'});
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255,255,255,${p => p.$pop ? '0.25' : '0.1'});
  border-radius: 24px;
  padding: 2.5rem;
  transition: all 0.4s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const BotanicalCardName = styled.h3`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 400;
  color: rgba(255,255,255,0.95);
  margin-bottom: 0.5rem;
`;

const BotanicalCardPrice = styled.div`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.5rem;
  font-weight: 300;
  color: rgba(255,255,255,0.95);
  margin-bottom: 0.25rem;
  
  span { font-size: 1.2rem; color: rgba(255,255,255,0.5); }
`;

const BotanicalCardDuration = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 1.5rem;
`;

const BotanicalFeatureList = styled.ul`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const BotanicalFeature = styled.li`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '·';
    color: rgba(255,255,255,0.4);
    flex-shrink: 0;
  }
`;

const BotanicalAddonsTitle = styled(AddonsTitle)`
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  color: rgba(255,255,255,0.8);
  margin-top: auto;
  padding-top: 1.5rem;
`;

const BotanicalAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

const BotanicalAddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BotanicalAddonCheck = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${p => p.$included ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'};
  border-radius: 50%;
  background: ${p => p.$included ? 'rgba(255,255,255,0.2)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.8);
`;

const BotanicalAddonName = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
`;

const BotanicalAddonPrice = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$included ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.6)'};
`;

const BotanicalCTA = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  border: none;
  
  ${p => p.$pop ? css`
    background: rgba(255,255,255,0.95);
    color: #040604;
    &:hover { transform: translateY(-2px); }
  ` : css`
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.9);
    border: 1px solid rgba(255,255,255,0.2);
    &:hover { background: rgba(255,255,255,0.15); }
  `}
`;

// ============================================
// CONTEMPORARY THEME
// ============================================
const ContemporarySection = styled(Section)`
  background: #FFE66D;
`;

const ContemporaryEyebrow = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #0D0D0D;
  margin-bottom: 0.5rem;
`;

const ContemporaryTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  color: #0D0D0D;
`;

const ContemporaryCard = styled.div`
  background: #fff;
  border: 3px solid #0D0D0D;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${p => p.$pop ? '8px 8px 0 #FF6B6B' : '6px 6px 0 #0D0D0D'};
  display: flex;
  flex-direction: column;
  
  ${p => p.$pop && css`
    &::before {
      content: '🔥 POPULAR';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: #FF6B6B;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.4rem 1rem;
      border: 2px solid #0D0D0D;
    }
  `}
  
  &:hover {
    transform: translate(-4px, -4px);
    box-shadow: ${p => p.$pop ? '12px 12px 0 #FF6B6B' : '10px 10px 0 #0D0D0D'};
  }
`;

const ContemporaryCardName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0D0D0D;
  margin-bottom: 0.5rem;
`;

const ContemporaryCardPrice = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$pop ? '#FF6B6B' : '#0D0D0D'};
  margin-bottom: 0.25rem;
  
  span { font-size: 1.2rem; }
`;

const ContemporaryCardDuration = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const ContemporaryFeatureList = styled.ul`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const ContemporaryFeature = styled.li`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  color: #444;
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '→';
    color: #4ECDC4;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const ContemporaryAddonsTitle = styled(AddonsTitle)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #0D0D0D;
  margin-top: auto;
  padding-top: 1.5rem;
`;

const ContemporaryAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  background: ${p => p.$included ? 'rgba(78, 205, 196, 0.15)' : '#F5F5F5'};
  border: 2px solid ${p => p.$included ? '#4ECDC4' : '#E5E5E5'};
`;

const ContemporaryAddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ContemporaryAddonCheck = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${p => p.$included ? '#4ECDC4' : '#999'};
  background: ${p => p.$included ? '#4ECDC4' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #fff;
`;

const ContemporaryAddonName = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
`;

const ContemporaryAddonPrice = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${p => p.$included ? '#4ECDC4' : '#666'};
`;

const ContemporaryCTA = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid #0D0D0D;
  
  ${p => p.$pop ? css`
    background: #FF6B6B;
    color: #fff;
    box-shadow: 4px 4px 0 #0D0D0D;
    &:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #0D0D0D; }
  ` : css`
    background: transparent;
    color: #0D0D0D;
    &:hover { background: #4ECDC4; }
  `}
`;

// ============================================
// LUXE THEME
// ============================================
const LuxeSection = styled(Section)`
  background: #0A0A0A;
`;

const LuxeEyebrow = styled.p`
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #C9A962;
  margin-bottom: 1rem;
`;

const LuxeTitle = styled.h2`
  font-family: 'Cormorant', serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  font-style: italic;
  color: #F8F6F3;
`;

const LuxeCard = styled.div`
  background: ${p => p.$pop ? 'rgba(201, 169, 98, 0.05)' : 'transparent'};
  border: 1px solid ${p => p.$pop ? '#C9A962' : 'rgba(248, 246, 243, 0.15)'};
  padding: 2.5rem;
  position: relative;
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  
  ${p => p.$pop && css`
    &::before {
      content: 'Empfohlen';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: #C9A962;
      color: #0A0A0A;
      font-family: 'Outfit', sans-serif;
      font-size: 0.6rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 0.5rem 1.5rem;
    }
  `}
`;

const LuxeCardName = styled.h3`
  font-family: 'Cormorant', serif;
  font-size: 1.6rem;
  font-weight: 300;
  font-style: italic;
  color: #F8F6F3;
  margin-bottom: 0.5rem;
`;

const LuxeCardPrice = styled.div`
  font-family: 'Cormorant', serif;
  font-size: 2.5rem;
  font-weight: 300;
  color: ${p => p.$pop ? '#C9A962' : '#F8F6F3'};
  margin-bottom: 0.25rem;
  
  span { font-size: 1.2rem; color: rgba(248,246,243,0.5); }
`;

const LuxeCardDuration = styled.p`
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: rgba(248, 246, 243, 0.4);
  margin-bottom: 1.5rem;
`;

const LuxeFeatureList = styled.ul`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const LuxeFeature = styled.li`
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: rgba(248, 246, 243, 0.6);
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '—';
    color: #C9A962;
    flex-shrink: 0;
  }
`;

const LuxeAddonsTitle = styled(AddonsTitle)`
  font-family: 'Cormorant', serif;
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(248, 246, 243, 0.7);
  margin-top: auto;
  padding-top: 1.5rem;
`;

const LuxeAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(248, 246, 243, 0.08);
`;

const LuxeAddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LuxeAddonCheck = styled.div`
  width: 14px;
  height: 14px;
  border: 1px solid ${p => p.$included ? '#C9A962' : 'rgba(248, 246, 243, 0.3)'};
  background: ${p => p.$included ? '#C9A962' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  color: #0A0A0A;
`;

const LuxeAddonName = styled.span`
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: rgba(248, 246, 243, 0.6);
`;

const LuxeAddonPrice = styled.span`
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$included ? '#C9A962' : 'rgba(248, 246, 243, 0.5)'};
`;

const LuxeCTA = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.5s ease;
  border: none;
  
  ${p => p.$pop ? css`
    background: #C9A962;
    color: #0A0A0A;
    &:hover { background: #d4b66f; }
  ` : css`
    background: transparent;
    color: #F8F6F3;
    border: 1px solid rgba(248, 246, 243, 0.3);
    &:hover { border-color: #C9A962; color: #C9A962; }
  `}
`;

// ============================================
// NEON THEME
// ============================================
const NeonSection = styled(Section)`
  background: #0a0a0f;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 20% 20%, rgba(0,255,255,0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const NeonEyebrow = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.5);
  margin-bottom: 0.5rem;
`;

const NeonTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
`;

const NeonCard = styled.div`
  background: rgba(255,255,255,0.02);
  border: 1px solid ${p => p.$pop ? '#00ffff' : 'rgba(0,255,255,0.2)'};
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  ${p => p.$pop && css`
    box-shadow: 0 0 30px rgba(0,255,255,0.2);
  `}
  
  &:hover {
    border-color: #00ffff;
    box-shadow: 0 0 20px rgba(0,255,255,0.2);
  }
`;

const NeonCardName = styled.h3`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const NeonCardPrice = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$pop ? '#00ffff' : '#fff'};
  text-shadow: ${p => p.$pop ? '0 0 20px rgba(0,255,255,0.5)' : 'none'};
  margin-bottom: 0.25rem;
  
  span { font-size: 1.2rem; color: rgba(255,255,255,0.4); }
`;

const NeonCardDuration = styled.p`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 1.5rem;
`;

const NeonFeatureList = styled.ul`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const NeonFeature = styled.li`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '>';
    color: #00ff88;
    flex-shrink: 0;
  }
`;

const NeonAddonsTitle = styled(AddonsTitle)`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #ff00ff;
  text-shadow: 0 0 10px rgba(255,0,255,0.5);
  margin-top: auto;
  padding-top: 1.5rem;
`;

const NeonAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,255,255,0.1);
`;

const NeonAddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NeonAddonCheck = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${p => p.$included ? '#00ff88' : 'rgba(255,255,255,0.3)'};
  background: ${p => p.$included ? 'rgba(0,255,136,0.2)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: #00ff88;
  box-shadow: ${p => p.$included ? '0 0 10px rgba(0,255,136,0.3)' : 'none'};
`;

const NeonAddonName = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.6);
`;

const NeonAddonPrice = styled.span`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$included ? '#00ff88' : 'rgba(255,255,255,0.5)'};
  text-shadow: ${p => p.$included ? '0 0 5px rgba(0,255,136,0.5)' : 'none'};
`;

const NeonCTA = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  ${p => p.$pop ? css`
    background: transparent;
    color: #00ffff;
    border: 1px solid #00ffff;
    box-shadow: 0 0 15px rgba(0,255,255,0.3);
    &:hover { background: rgba(0,255,255,0.1); box-shadow: 0 0 25px rgba(0,255,255,0.5); }
  ` : css`
    background: transparent;
    color: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.2);
    &:hover { border-color: #ff00ff; color: #ff00ff; }
  `}
`;

// ============================================
// VIDEO THEME
// ============================================
const VideoSection = styled(Section)`
  background: #0A0A0A;
`;

const VideoEyebrow = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #6B8CAE;
  margin-bottom: 1rem;
`;

const VideoTitle = styled.h2`
  font-family: 'Manrope', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #fff;
`;

const VideoCard = styled.div`
  background: ${p => p.$pop ? 'rgba(107, 140, 174, 0.05)' : 'transparent'};
  border: 1px solid ${p => p.$pop ? '#6B8CAE' : 'rgba(255,255,255,0.1)'};
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  ${p => p.$pop && css`
    &::before {
      content: 'Empfohlen';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: #6B8CAE;
      color: #0A0A0A;
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 0.4rem 1rem;
    }
  `}
  
  &:hover {
    border-color: #6B8CAE;
  }
`;

const VideoCardName = styled.h3`
  font-family: 'Manrope', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const VideoCardPrice = styled.div`
  font-family: 'Manrope', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${p => p.$pop ? '#6B8CAE' : '#fff'};
  margin-bottom: 0.25rem;
  
  span { font-size: 1.2rem; color: #888; }
`;

const VideoCardDuration = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.4);
  margin-bottom: 1.5rem;
`;

const VideoFeatureList = styled.ul`
  margin-bottom: 1.5rem;
  flex: 1;
`;

const VideoFeature = styled.li`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #B0B0B0;
  padding: 0.4rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  &::before {
    content: '✓';
    color: #6B8CAE;
    flex-shrink: 0;
  }
`;

const VideoAddonsTitle = styled(AddonsTitle)`
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
  margin-top: auto;
  padding-top: 1.5rem;
`;

const VideoAddon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`;

const VideoAddonInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const VideoAddonCheck = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid ${p => p.$included ? '#6B8CAE' : 'rgba(255,255,255,0.3)'};
  background: ${p => p.$included ? '#6B8CAE' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: #0A0A0A;
`;

const VideoAddonName = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #B0B0B0;
`;

const VideoAddonPrice = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: ${p => p.$included ? '#6B8CAE' : 'rgba(255,255,255,0.5)'};
`;

const VideoCTA = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  font-family: 'Manrope', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  ${p => p.$pop ? css`
    background: #6B8CAE;
    color: #0A0A0A;
    &:hover { background: #7d9cba; }
  ` : css`
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
    &:hover { border-color: #6B8CAE; color: #6B8CAE; }
  `}
`;

// ============================================
// MAIN COMPONENT
// ============================================
const PricingSection = () => {
  const { currentTheme } = useTheme();
  
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderAddon = (addon, pkgAddons, AddonRow, AddonInfo, AddonCheck, AddonName, AddonPrice) => {
    const addonData = pkgAddons[addon.id];
    return (
      <AddonRow key={addon.id} $included={addonData.included}>
        <AddonInfo>
          <AddonCheck $included={addonData.included}>
            {addonData.included && '✓'}
          </AddonCheck>
          <AddonName>{addon.name}</AddonName>
        </AddonInfo>
        <AddonPrice $included={addonData.included}>
          {addonData.included ? 'Im Paket' : `+${addonData.price}€`}
        </AddonPrice>
      </AddonRow>
    );
  };

  // Theme-spezifische OnRequest Box Styles
  const getOnRequestStyles = () => {
    switch(currentTheme) {
      case 'editorial':
        return {
          box: { background: '#fff', border: '1px solid #E5E5E5' },
          title: { fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: '#0A0A0A' },
          items: { fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: '#666' },
          note: { fontFamily: "'Source Serif 4', serif", fontSize: '0.95rem', color: '#C41E3A' }
        };
      case 'botanical':
        return {
          box: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px' },
          title: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 400, color: 'rgba(255,255,255,0.9)' },
          items: { fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' },
          note: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }
        };
      case 'contemporary':
        return {
          box: { background: '#fff', border: '3px solid #0D0D0D', boxShadow: '6px 6px 0 #4ECDC4' },
          title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', color: '#0D0D0D' },
          items: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#525252' },
          note: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: '#FF6B6B' }
        };
      case 'luxe':
        return {
          box: { background: 'rgba(201,169,98,0.05)', border: '1px solid rgba(201,169,98,0.3)' },
          title: { fontFamily: "'Cormorant', serif", fontSize: '1.3rem', fontWeight: 300, fontStyle: 'italic', color: '#F8F6F3' },
          items: { fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 300, color: 'rgba(248,246,243,0.6)' },
          note: { fontFamily: "'Cormorant', serif", fontSize: '1rem', fontStyle: 'italic', color: '#C9A962' }
        };
      case 'neon':
        return {
          box: { background: 'rgba(0,255,255,0.02)', border: '1px solid rgba(0,255,255,0.2)' },
          title: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', color: '#00ffff', textShadow: '0 0 10px rgba(0,255,255,0.5)' },
          items: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' },
          note: { fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', color: '#ff00ff', textShadow: '0 0 10px rgba(255,0,255,0.5)' }
        };
      default: // video
        return {
          box: { background: 'rgba(107,140,174,0.05)', border: '1px solid rgba(255,255,255,0.1)' },
          title: { fontFamily: "'Manrope', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff' },
          items: { fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#B0B0B0' },
          note: { fontFamily: "'Manrope', sans-serif", fontSize: '0.9rem', color: '#6B8CAE' }
        };
    }
  };

  const renderOnRequest = () => {
    const styles = getOnRequestStyles();
    return (
      <OnRequestBox style={styles.box}>
        <OnRequestTitle style={styles.title}>Auf Anfrage</OnRequestTitle>
        <OnRequestItems style={styles.items}>
          {ON_REQUEST_ITEMS.join(' · ')}
        </OnRequestItems>
        <OnRequestNote style={styles.note}>
          Preislich finden wir da sicher zusammen ;)
        </OnRequestNote>
      </OnRequestBox>
    );
  };

  // EDITORIAL
  if (currentTheme === 'editorial') {
    return (
      <EditorialSection id="pricing">
        <Container>
          <Header>
            <EditorialEyebrow>Preise</EditorialEyebrow>
            <EditorialTitle>Findet euer Paket</EditorialTitle>
          </Header>
          <Grid>
            {PACKAGES.map(pkg => (
              <EditorialCard key={pkg.id} $pop={pkg.popular}>
                <EditorialCardName>{pkg.name}</EditorialCardName>
                {pkg.tagline && <PkgTagline>{pkg.tagline}</PkgTagline>}
                <EditorialCardPrice $pop={pkg.popular}>
                  <span>€</span>{pkg.price}
                </EditorialCardPrice>
                <EditorialCardDuration>{pkg.duration}</EditorialCardDuration>
                <EditorialFeatureList>
                  {pkg.features.map((f, i) => <EditorialFeature key={i}>{f}</EditorialFeature>)}
                </EditorialFeatureList>
                <EditorialAddonsTitle>Zusatzoptionen</EditorialAddonsTitle>
                <AddonsList>
                  {ADDONS.map(addon => renderAddon(addon, pkg.addons, EditorialAddon, EditorialAddonInfo, EditorialAddonCheck, EditorialAddonName, EditorialAddonPrice))}
                </AddonsList>
                <EditorialCTA $pop={pkg.popular} onClick={scrollToContact}>{pkg.cta}</EditorialCTA>
              </EditorialCard>
            ))}
          </Grid>
          {renderOnRequest()}
        </Container>
      </EditorialSection>
    );
  }

  // BOTANICAL
  if (currentTheme === 'botanical') {
    return (
      <BotanicalSection id="pricing">
        <Container>
          <Header>
            <BotanicalEyebrow>Preise</BotanicalEyebrow>
            <BotanicalTitle>Findet euer Paket</BotanicalTitle>
          </Header>
          <Grid>
            {PACKAGES.map(pkg => (
              <BotanicalCard key={pkg.id} $pop={pkg.popular}>
                <BotanicalCardName>{pkg.name}</BotanicalCardName>
                {pkg.tagline && <PkgTagline>{pkg.tagline}</PkgTagline>}
                <BotanicalCardPrice $pop={pkg.popular}>
                  <span>€</span>{pkg.price}
                </BotanicalCardPrice>
                <BotanicalCardDuration>{pkg.duration}</BotanicalCardDuration>
                <BotanicalFeatureList>
                  {pkg.features.map((f, i) => <BotanicalFeature key={i}>{f}</BotanicalFeature>)}
                </BotanicalFeatureList>
                <BotanicalAddonsTitle>Zusatzoptionen</BotanicalAddonsTitle>
                <AddonsList>
                  {ADDONS.map(addon => renderAddon(addon, pkg.addons, BotanicalAddon, BotanicalAddonInfo, BotanicalAddonCheck, BotanicalAddonName, BotanicalAddonPrice))}
                </AddonsList>
                <BotanicalCTA $pop={pkg.popular} onClick={scrollToContact}>{pkg.cta}</BotanicalCTA>
              </BotanicalCard>
            ))}
          </Grid>
          {renderOnRequest()}
        </Container>
      </BotanicalSection>
    );
  }

  // CONTEMPORARY
  if (currentTheme === 'contemporary') {
    return (
      <ContemporarySection id="pricing">
        <Container>
          <Header>
            <ContemporaryEyebrow>💰 Preise</ContemporaryEyebrow>
            <ContemporaryTitle>Pick your Plan</ContemporaryTitle>
          </Header>
          <Grid>
            {PACKAGES.map(pkg => (
              <ContemporaryCard key={pkg.id} $pop={pkg.popular}>
                <ContemporaryCardName>{pkg.name}</ContemporaryCardName>
                {pkg.tagline && <PkgTagline>{pkg.tagline}</PkgTagline>}
                <ContemporaryCardPrice $pop={pkg.popular}>
                  <span>€</span>{pkg.price}
                </ContemporaryCardPrice>
                <ContemporaryCardDuration>{pkg.duration}</ContemporaryCardDuration>
                <ContemporaryFeatureList>
                  {pkg.features.map((f, i) => <ContemporaryFeature key={i}>{f}</ContemporaryFeature>)}
                </ContemporaryFeatureList>
                <ContemporaryAddonsTitle>Add-ons</ContemporaryAddonsTitle>
                <AddonsList>
                  {ADDONS.map(addon => renderAddon(addon, pkg.addons, ContemporaryAddon, ContemporaryAddonInfo, ContemporaryAddonCheck, ContemporaryAddonName, ContemporaryAddonPrice))}
                </AddonsList>
                <ContemporaryCTA $pop={pkg.popular} onClick={scrollToContact}>{pkg.cta}</ContemporaryCTA>
              </ContemporaryCard>
            ))}
          </Grid>
          {renderOnRequest()}
        </Container>
      </ContemporarySection>
    );
  }

  // LUXE
  if (currentTheme === 'luxe') {
    return (
      <LuxeSection id="pricing">
        <Container>
          <Header>
            <LuxeEyebrow>Preise</LuxeEyebrow>
            <LuxeTitle>Findet euer Paket</LuxeTitle>
          </Header>
          <Grid>
            {PACKAGES.map(pkg => (
              <LuxeCard key={pkg.id} $pop={pkg.popular}>
                <LuxeCardName>{pkg.name}</LuxeCardName>
                {pkg.tagline && <PkgTagline>{pkg.tagline}</PkgTagline>}
                <LuxeCardPrice $pop={pkg.popular}>
                  <span>€</span>{pkg.price}
                </LuxeCardPrice>
                <LuxeCardDuration>{pkg.duration}</LuxeCardDuration>
                <LuxeFeatureList>
                  {pkg.features.map((f, i) => <LuxeFeature key={i}>{f}</LuxeFeature>)}
                </LuxeFeatureList>
                <LuxeAddonsTitle>Zusatzoptionen</LuxeAddonsTitle>
                <AddonsList>
                  {ADDONS.map(addon => renderAddon(addon, pkg.addons, LuxeAddon, LuxeAddonInfo, LuxeAddonCheck, LuxeAddonName, LuxeAddonPrice))}
                </AddonsList>
                <LuxeCTA $pop={pkg.popular} onClick={scrollToContact}>{pkg.cta}</LuxeCTA>
              </LuxeCard>
            ))}
          </Grid>
          {renderOnRequest()}
        </Container>
      </LuxeSection>
    );
  }

  // NEON
  if (currentTheme === 'neon') {
    return (
      <NeonSection id="pricing">
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Header>
            <NeonEyebrow>// pricing.plans</NeonEyebrow>
            <NeonTitle>Select Package</NeonTitle>
          </Header>
          <Grid>
            {PACKAGES.map(pkg => (
              <NeonCard key={pkg.id} $pop={pkg.popular}>
                <NeonCardName>{pkg.name}</NeonCardName>
                {pkg.tagline && <PkgTagline>{pkg.tagline}</PkgTagline>}
                <NeonCardPrice $pop={pkg.popular}>
                  <span>€</span>{pkg.price}
                </NeonCardPrice>
                <NeonCardDuration>{pkg.duration}</NeonCardDuration>
                <NeonFeatureList>
                  {pkg.features.map((f, i) => <NeonFeature key={i}>{f}</NeonFeature>)}
                </NeonFeatureList>
                <NeonAddonsTitle>// add-ons</NeonAddonsTitle>
                <AddonsList>
                  {ADDONS.map(addon => renderAddon(addon, pkg.addons, NeonAddon, NeonAddonInfo, NeonAddonCheck, NeonAddonName, NeonAddonPrice))}
                </AddonsList>
                <NeonCTA $pop={pkg.popular} onClick={scrollToContact}>{pkg.cta}</NeonCTA>
              </NeonCard>
            ))}
          </Grid>
          {renderOnRequest()}
        </Container>
      </NeonSection>
    );
  }

  // VIDEO (Default)
  return (
    <VideoSection id="pricing">
      <Container>
        <Header>
          <VideoEyebrow>Preise</VideoEyebrow>
          <VideoTitle>Findet euer Paket</VideoTitle>
        </Header>
        <Grid>
          {PACKAGES.map(pkg => (
            <VideoCard key={pkg.id} $pop={pkg.popular}>
              <VideoCardName>{pkg.name}</VideoCardName>
              {pkg.tagline && <PkgTagline>{pkg.tagline}</PkgTagline>}
              <VideoCardPrice $pop={pkg.popular}>
                <span>€</span>{pkg.price}
              </VideoCardPrice>
              <VideoCardDuration>{pkg.duration}</VideoCardDuration>
              <VideoFeatureList>
                {pkg.features.map((f, i) => <VideoFeature key={i}>{f}</VideoFeature>)}
              </VideoFeatureList>
              <VideoAddonsTitle>Zusatzoptionen</VideoAddonsTitle>
              <AddonsList>
                {ADDONS.map(addon => renderAddon(addon, pkg.addons, VideoAddon, VideoAddonInfo, VideoAddonCheck, VideoAddonName, VideoAddonPrice))}
              </AddonsList>
              <VideoCTA $pop={pkg.popular} onClick={scrollToContact}>{pkg.cta}</VideoCTA>
            </VideoCard>
          ))}
        </Grid>
        {renderOnRequest()}
      </Container>
    </VideoSection>
  );
};

export default PricingSection;
