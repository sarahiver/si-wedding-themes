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

const DresscodeTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
  max-width: 550px;
  margin: 0 auto;
`;

const ColorPalette = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ColorSwatch = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${p => p.$color};
  border: 2px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    border-color: rgba(255,255,255,0.4);
  }
`;

const Tips = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: left;
`;

const TipsTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1rem;
  text-align: center;
`;

const TipsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-muted);
  
  span:first-child {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
`;

function Dresscode() {
  const { content } = useWedding();
  const dresscodeData = content?.dresscode || {};
  
  const title = dresscodeData.title || 'Dresscode';
  const style = dresscodeData.style || 'Festlich elegant';
  const description = dresscodeData.description || 'Wir freuen uns, wenn ihr in festlicher Kleidung erscheint. Gedeckte Farben passen perfekt zu unserer Location.';
  const colors = dresscodeData.colors || ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'];
  const tips = dresscodeData.tips || [];
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const defaultTips = [
    { icon: '👔', text: 'Herren: Anzug oder Sakko mit Hemd' },
    { icon: '👗', text: 'Damen: Cocktailkleid oder elegantes Outfit' },
    { icon: '👠', text: 'Bequeme Schuhe für die Tanzfläche' },
    { icon: '🌿', text: 'Grün- und Erdtöne passen perfekt' },
  ];

  const displayTips = tips.length > 0 ? tips : defaultTips;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="dresscode" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Was ziehe ich an?</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        
        <GlassCard $visible={visible}>
          <Icon>👔</Icon>
          <DresscodeTitle>{style}</DresscodeTitle>
          <Description>{description}</Description>
          
          {colors && colors.length > 0 && (
            <ColorPalette>
              {colors.map((color, i) => (
                <ColorSwatch key={i} $color={color} title={color} />
              ))}
            </ColorPalette>
          )}
          
          {displayTips.length > 0 && (
            <Tips>
              <TipsTitle>Tipps</TipsTitle>
              <TipsList>
                {displayTips.map((tip, i) => (
                  <TipItem key={i}>
                    <span>{tip.icon}</span>
                    <span>{tip.text}</span>
                  </TipItem>
                ))}
              </TipsList>
            </Tips>
          )}
        </GlassCard>
      </Container>
    </Section>
  );
}

export default Dresscode;
