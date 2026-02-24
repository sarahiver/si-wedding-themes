// Luxe Hero - Cinematic Fullscreen (Phenomenon Style)
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

// Cinematic Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { transform: scale(1.2); }
  to { transform: scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const revealText = keyframes`
  from { transform: translateY(110%); }
  to { transform: translateY(0); }
`;

const expandLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// Styled Components
const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--luxe-void);
`;

const BackgroundMedia = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10, 10, 10, 0.3) 0%,
      rgba(10, 10, 10, 0.5) 50%,
      rgba(10, 10, 10, 0.8) 100%
    );
  }
`;

const BackgroundImage = styled.div`
  width: 100%;
  height: 100%;
  background: ${p => p.$image ? `url(${p.$image})` : 'linear-gradient(135deg, var(--luxe-charcoal) 0%, var(--luxe-void) 100%)'};
  background-size: cover;
  background-position: center;
  opacity: ${p => p.$loaded ? 1 : 0};
  transform: scale(${p => p.$loaded ? 1 : 1.2});
  transition: opacity 1.5s ease, transform 8s ease-out;
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 var(--section-padding-x);
  max-width: 1000px;
`;

const Eyebrow = styled.div`
  overflow: hidden;
  margin-bottom: 2rem;
`;

const EyebrowText = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  opacity: 0;
  transform: translateY(20px);
  animation: ${p => p.$visible ? css`${slideUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.5s;
`;

const NamesContainer = styled.div`
  margin-bottom: 3rem;
`;

const NameLine = styled.div`
  overflow: hidden;
`;

const Name = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  line-height: 0.9;
  letter-spacing: -0.03em;
  transform: translateY(110%);
  animation: ${p => p.$visible ? css`${revealText} 1.2s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: ${p => p.$delay || '0s'};
`;

const Ampersand = styled.div`
  overflow: hidden;
  margin: 1rem 0;
`;

const AmpersandText = styled.span`
  display: inline-block;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-gold);
  transform: translateY(110%);
  animation: ${p => p.$visible ? css`${revealText} 1s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.9s;
`;

const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: var(--luxe-gold);
  margin: 2.5rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${p => p.$visible ? css`${expandLine} 1s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 1.3s;
`;

const InfoContainer = styled.div`
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s ease forwards` : 'none'};
  animation-delay: 1.5s;
`;

const DateText = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-style: italic;
  color: var(--luxe-cream);
  margin-bottom: 0.5rem;
`;

const LocationText = styled.p`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-pearl);
`;

// Component
function Hero({ isSaveTheDate = false, isArchive = false }) {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  const stdData = content?.savethedate || {};
  const archiveData = content?.archive || {};
  
  // NEU: project hat Priorität vor heroData
  const name1 = project?.partner1_name || heroData.name1 || 'Alexandra';
  const name2 = project?.partner2_name || heroData.name2 || 'Benjamin';
  const date = project?.wedding_date || heroData.date;
  const location = project?.location || heroData.location || '';
  
  // Eyebrow je nach Modus
  let eyebrowText;
  if (isArchive) {
    eyebrowText = archiveData.thank_you_title || 'Danke!';
  } else if (isSaveTheDate) {
    eyebrowText = stdData.tagline || 'Save the Date';
  } else {
    eyebrowText = 'Wir heiraten';
  }
  
  // Background Image je nach Modus
  let backgroundImage;
  if (isArchive && archiveData.hero_image) {
    backgroundImage = archiveData.hero_image;
  } else if (isSaveTheDate && stdData.hero_image) {
    backgroundImage = stdData.hero_image;
  } else {
    backgroundImage = heroData.background_image;
  }
  
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date 
    ? new Date(date).toLocaleDateString('de-DE', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : '21. September 2025';

  return (
    <Section id="hero">
      <BackgroundMedia>
        <BackgroundImage $image={optimizedUrl.hero(backgroundImage)} $loaded={loaded} />
      </BackgroundMedia>
      
      <Content>
        <Eyebrow>
          <EyebrowText $visible={visible}>{eyebrowText}</EyebrowText>
        </Eyebrow>
        
        <NamesContainer>
          <NameLine>
            <Name $visible={visible} $delay="0.6s">{name1}</Name>
          </NameLine>
          <Ampersand>
            <AmpersandText $visible={visible}>&</AmpersandText>
          </Ampersand>
          <NameLine>
            <Name $visible={visible} $delay="0.75s">{name2}</Name>
          </NameLine>
        </NamesContainer>
        
        <Divider $visible={visible} />
        
        <InfoContainer $visible={visible}>
          <DateText>{formattedDate}</DateText>
          <LocationText>{location}</LocationText>
        </InfoContainer>
      </Content>
      
    </Section>
  );
}

export default Hero;
