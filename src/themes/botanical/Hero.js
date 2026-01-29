// Botanical Hero - Animated Watercolor Forest Scene
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { RoundTree, PineTree, BlobTree, TallTree, Bush, Sheep, Branch, Leaf } from './TreeIllustrations';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const grow = keyframes`
  from { transform: scale(0) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
`;

const drawPath = keyframes`
  from { stroke-dashoffset: 500; }
  to { stroke-dashoffset: 0; }
`;

const leafDrop = keyframes`
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// Styled Components
const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, 
    var(--botanical-warm) 0%, 
    var(--botanical-cream) 50%,
    var(--botanical-mint) 100%
  );
  overflow: hidden;
`;

const ForestBackground = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

// Animated Trees positioned around the scene
const TreeContainer = styled.div`
  position: absolute;
  bottom: ${p => p.$bottom || '0'};
  left: ${p => p.$left || 'auto'};
  right: ${p => p.$right || 'auto'};
  opacity: 0;
  animation: ${p => p.$visible ? css`${grow} 1s var(--ease-organic) forwards` : 'none'};
  animation-delay: ${p => p.$delay || '0s'};
  z-index: ${p => p.$z || 1};
  
  & > div {
    animation: ${sway} ${p => p.$swayDuration || '4s'} ease-in-out infinite;
    animation-delay: ${p => p.$swayDelay || '0s'};
  }
`;

const FallingLeaf = styled.div`
  position: absolute;
  top: -50px;
  left: ${p => p.$left};
  animation: ${leafDrop} ${p => p.$duration || '8s'} linear infinite;
  animation-delay: ${p => p.$delay || '0s'};
  opacity: 0.7;
  
  svg {
    width: ${p => p.$size || '20px'};
    fill: ${p => p.$color || 'var(--botanical-sage)'};
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--botanical-olive);
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${slideUp} 0.8s ease forwards` : 'none'};
  animation-delay: 0.5s;
`;

const NamesContainer = styled.div`
  margin-bottom: 2rem;
`;

const Names = styled.h1`
  font-family: var(--font-handwritten);
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 600;
  color: var(--botanical-forest);
  line-height: 1;
  opacity: 0;
  animation: ${p => p.$visible ? css`${slideUp} 1s var(--ease-organic) forwards` : 'none'};
  animation-delay: ${p => p.$delay || '0.6s'};
  
  /* Watercolor text effect */
  text-shadow: 
    2px 2px 0 var(--botanical-mint),
    -1px -1px 0 var(--botanical-sage);
`;

const Ampersand = styled.span`
  display: block;
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 4rem);
  font-style: italic;
  color: var(--botanical-sage);
  margin: 0.5rem 0;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s ease forwards, ${float} 3s ease-in-out infinite` : 'none'};
  animation-delay: 0.8s, 0.8s;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s ease forwards` : 'none'};
  animation-delay: 1s;
`;

const DividerLine = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--botanical-sage), transparent);
`;

const DividerLeaf = styled.div`
  font-size: 1.5rem;
  animation: ${float} 2s ease-in-out infinite;
`;

const DateText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: var(--botanical-olive);
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${slideUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.2s;
`;

const LocationText = styled.p`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--botanical-teal);
  opacity: 0;
  animation: ${p => p.$visible ? css`${slideUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.4s;
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1s ease forwards` : 'none'};
  animation-delay: 2s;
`;

const ScrollText = styled.span`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--botanical-olive);
`;

const ScrollLeaf = styled.div`
  font-size: 1.5rem;
  animation: ${float} 1.5s ease-in-out infinite;
`;

// Couple silhouette
const CoupleWrapper = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1.5s ease forwards` : 'none'};
  animation-delay: 1.5s;
`;

const CoupleSVG = () => (
  <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
    {/* Blanket */}
    <ellipse cx="40" cy="55" rx="35" ry="8" fill="var(--botanical-sage)" opacity="0.6" />
    {/* Person 1 */}
    <circle cx="30" cy="30" r="8" fill="var(--botanical-charcoal)" />
    <path d="M22 40 Q25 50 30 55 Q35 50 38 40" fill="var(--botanical-olive)" />
    {/* Person 2 */}
    <circle cx="50" cy="28" r="8" fill="var(--botanical-brown)" />
    <path d="M42 38 Q45 50 50 55 Q55 50 58 38" fill="var(--botanical-terracotta)" />
  </svg>
);

function Hero() {
  const { content, project } = useWedding();
  const heroData = content?.hero || {};
  
  const name1 = heroData.name1 || project?.partner1_name || 'Emma';
  const name2 = heroData.name2 || project?.partner2_name || 'Noah';
  const date = heroData.date || project?.wedding_date;
  const location = heroData.location || project?.location || 'Botanischer Garten, Berlin';
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = date 
    ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '21. Juni 2025';

  // Falling leaves
  const leaves = Array.from({ length: 8 }, (_, i) => ({
    left: `${10 + i * 12}%`,
    delay: `${i * 1.5}s`,
    duration: `${8 + Math.random() * 4}s`,
    size: `${15 + Math.random() * 15}px`,
    color: ['var(--botanical-sage)', 'var(--botanical-olive)', 'var(--botanical-lime)', 'var(--botanical-mint)'][i % 4]
  }));

  return (
    <Section id="hero">
      <ForestBackground>
        {/* Back row trees */}
        <TreeContainer $visible={visible} $left="5%" $bottom="10%" $delay="0.2s" $z={1} $swayDuration="5s">
          <RoundTree color="var(--botanical-sage)" size="100px" $opacity={0.6} />
        </TreeContainer>
        <TreeContainer $visible={visible} $left="15%" $bottom="5%" $delay="0.4s" $z={1} $swayDuration="6s" $swayDelay="0.5s">
          <TallTree color="var(--botanical-teal)" size="70px" $opacity={0.7} />
        </TreeContainer>
        <TreeContainer $visible={visible} $right="10%" $bottom="8%" $delay="0.3s" $z={1} $swayDuration="5.5s">
          <BlobTree color="var(--botanical-mint)" color2="var(--botanical-sage)" size="90px" $opacity={0.6} />
        </TreeContainer>
        <TreeContainer $visible={visible} $right="20%" $bottom="5%" $delay="0.5s" $z={1} $swayDuration="4.5s" $swayDelay="1s">
          <PineTree color="var(--botanical-forest)" size="80px" $opacity={0.7} />
        </TreeContainer>
        
        {/* Middle row */}
        <TreeContainer $visible={visible} $left="2%" $bottom="0" $delay="0.6s" $z={2} $swayDuration="4s">
          <RoundTree color="var(--botanical-olive)" size="140px" />
        </TreeContainer>
        <TreeContainer $visible={visible} $left="25%" $bottom="0" $delay="0.8s" $z={2} $swayDuration="5s" $swayDelay="0.3s">
          <BlobTree color="var(--botanical-lime)" color2="var(--botanical-sage)" size="110px" />
        </TreeContainer>
        <TreeContainer $visible={visible} $right="5%" $bottom="0" $delay="0.7s" $z={2} $swayDuration="4.5s">
          <RoundTree color="var(--botanical-teal)" size="130px" />
        </TreeContainer>
        <TreeContainer $visible={visible} $right="25%" $bottom="0" $delay="0.9s" $z={2} $swayDuration="5.5s" $swayDelay="0.7s">
          <TallTree color="var(--botanical-olive)" size="90px" />
        </TreeContainer>
        
        {/* Front bushes */}
        <TreeContainer $visible={visible} $left="10%" $bottom="-10px" $delay="1s" $z={3}>
          <Bush color="var(--botanical-lime)" size="100px" />
        </TreeContainer>
        <TreeContainer $visible={visible} $right="15%" $bottom="-10px" $delay="1.1s" $z={3}>
          <Bush color="var(--botanical-mint)" size="80px" />
        </TreeContainer>
        
        {/* Sheep */}
        <TreeContainer $visible={visible} $left="35%" $bottom="5%" $delay="1.5s" $z={2}>
          <Sheep size="35px" />
        </TreeContainer>
        <TreeContainer $visible={visible} $right="35%" $bottom="8%" $delay="1.7s" $z={1}>
          <Sheep size="25px" />
        </TreeContainer>
        
        {/* Falling leaves */}
        {leaves.map((leaf, i) => (
          <FallingLeaf key={i} $left={leaf.left} $delay={leaf.delay} $duration={leaf.duration} $size={leaf.size} $color={leaf.color}>
            <svg viewBox="0 0 30 40">
              <path d="M15 5 Q25 15 20 30 Q15 35 10 30 Q5 15 15 5" fill="currentColor" />
            </svg>
          </FallingLeaf>
        ))}
      </ForestBackground>
      
      {/* Couple */}
      <CoupleWrapper $visible={visible}>
        <CoupleSVG />
      </CoupleWrapper>
      
      <Content>
        <Eyebrow $visible={visible}>Wir heiraten</Eyebrow>
        <NamesContainer>
          <Names $visible={visible} $delay="0.6s">{name1}</Names>
          <Ampersand $visible={visible}>&</Ampersand>
          <Names $visible={visible} $delay="0.8s">{name2}</Names>
        </NamesContainer>
        
        <Divider $visible={visible}>
          <DividerLine />
          <DividerLeaf>🌿</DividerLeaf>
          <DividerLine />
        </Divider>
        
        <DateText $visible={visible}>{formattedDate}</DateText>
        <LocationText $visible={visible}>{location}</LocationText>
      </Content>
      
      <ScrollIndicator $visible={visible}>
        <ScrollText>Entdecken</ScrollText>
        <ScrollLeaf>🍃</ScrollLeaf>
      </ScrollIndicator>
    </Section>
  );
}

export default Hero;
