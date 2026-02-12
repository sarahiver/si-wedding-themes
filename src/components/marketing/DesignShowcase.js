// src/components/marketing/DesignShowcase.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
`;

const neonGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px rgba(0,255,255,0.5); }
  50% { text-shadow: 0 0 15px rgba(0,255,255,0.8); }
`;

// Theme data
const themes = [
  { id: 'editorial', name: 'Editorial', desc: 'Minimalistisch & Zeitlos' },
  { id: 'botanical', name: 'Botanical', desc: 'Natürlich & Organisch' },
  { id: 'contemporary', name: 'Contemporary', desc: 'Bold & Playful' },
  { id: 'neon', name: 'Neon', desc: 'Futuristisch & Elektrisierend' },
  { id: 'video', name: 'Video', desc: 'Cineastisch & Elegant' },
  { id: 'luxe', name: 'Luxe', desc: 'Opulent & Glamourös' },
  { id: 'classic', name: 'Classic', desc: 'Warm & Zeitlos' },
];

function DesignShowcase() {
  const { currentTheme, switchTheme } = useTheme();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDemoClick = (themeId) => {
    // Speichere aktuelle Scroll-Position und Theme
    sessionStorage.setItem('returnScrollPosition', window.scrollY.toString());
    sessionStorage.setItem('returnTheme', currentTheme);
    
    // Wechsle Theme und navigiere zur Demo
    switchTheme(themeId);
    navigate(`/demo?theme=${themeId}`);
  };

  return (
    <Section ref={sectionRef} $themeId={currentTheme} id="designs">
      <Container>
        <Header $visible={isVisible} $themeId={currentTheme}>
          <Eyebrow $themeId={currentTheme}>— Einzigartige Designs —</Eyebrow>
          <Title $themeId={currentTheme}>Wählt euren Stil</Title>
          <Subtitle $themeId={currentTheme}>
            Jedes Design erzählt eure Geschichte auf seine eigene Art
          </Subtitle>
        </Header>

        <Grid>
          {themes.map((theme, i) => (
            <ThemeCard 
              key={theme.id} 
              $visible={isVisible} 
              $delay={0.1 * i}
              onClick={() => handleDemoClick(theme.id)}
            >
              {/* Preview */}
              <PreviewWrapper>
                {theme.id === 'editorial' && <EditorialPreview />}
                {theme.id === 'botanical' && <BotanicalPreview />}
                {theme.id === 'contemporary' && <ContemporaryPreview />}
                {theme.id === 'neon' && <NeonPreview />}
                {theme.id === 'video' && <VideoPreview />}
                {theme.id === 'luxe' && <LuxePreview />}
              </PreviewWrapper>
              
              {/* Info */}
              <CardInfo $themeId={currentTheme}>
                <CardName $themeId={currentTheme}>{theme.name}</CardName>
                <CardDesc $themeId={currentTheme}>{theme.desc}</CardDesc>
                <DemoLink $themeId={currentTheme}>Demo ansehen →</DemoLink>
              </CardInfo>
            </ThemeCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default DesignShowcase;

// ============================================
// EDITORIAL PREVIEW
// ============================================
const EditorialPreview = () => (
  <EditorialBox>
    <EditorialLine $pos="top" />
    <EditorialLine $pos="bottom" />
    <EditorialLineV $pos="left" />
    <EditorialLineV $pos="right" />
    <EditorialContent>
      <span className="eyebrow">— Wir heiraten —</span>
      <span className="names">S & I</span>
      <span className="date">21.06.2025</span>
    </EditorialContent>
  </EditorialBox>
);

// ============================================
// BOTANICAL PREVIEW
// ============================================
const BotanicalPreview = () => (
  <BotanicalBox>
    <BotanicalLeaf $pos="tl">🌿</BotanicalLeaf>
    <BotanicalLeaf $pos="tr">🍃</BotanicalLeaf>
    <BotanicalLeaf $pos="bl">🌱</BotanicalLeaf>
    <BotanicalLeaf $pos="br">🌸</BotanicalLeaf>
    <BotanicalContent>
      <span className="eyebrow">Wo Liebe erblüht</span>
      <span className="names">S & I</span>
      <span className="date">21.06.2025</span>
    </BotanicalContent>
  </BotanicalBox>
);

// ============================================
// CONTEMPORARY PREVIEW
// ============================================
const ContemporaryPreview = () => (
  <ContemporaryBox>
    <ContemporaryGradient />
    <ContemporaryCircle $top="15%" $left="8%" $color="#FF6B6B" $size="25px" />
    <ContemporaryCircle $bottom="20%" $right="45%" $color="#4ECDC4" $size="18px" />
    <ContemporarySquare $top="60%" $left="15%" $color="#FFE66D" $size="15px" />
    <ContemporaryContent>
      <span className="date">21.06.2025</span>
      <span className="name1">SARAH</span>
      <span className="amp">&</span>
      <span className="name2">IVAR</span>
    </ContemporaryContent>
  </ContemporaryBox>
);

// ============================================
// NEON PREVIEW
// ============================================
const NeonPreview = () => (
  <NeonBox>
    <NeonGrid />
    <NeonFrame />
    <NeonContent>
      <span className="eyebrow">// LOVE.exe //</span>
      <span className="names">S & I</span>
      <span className="date">&gt; 21.06.2025_</span>
    </NeonContent>
  </NeonBox>
);

// ============================================
// VIDEO PREVIEW
// ============================================
const VideoPreview = () => (
  <VideoBox>
    <VideoOverlay />
    <VideoContent>
      <span className="eyebrow">— Eine Liebesgeschichte —</span>
      <span className="names">S & I</span>
      <span className="line" />
      <span className="date">21.06.2025</span>
    </VideoContent>
  </VideoBox>
);

// ============================================
// LUXE PREVIEW
// ============================================
const LuxePreview = () => (
  <LuxeBox>
    <LuxePattern />
    <LuxeContent>
      <span className="diamond">✦</span>
      <span className="names">S & I</span>
      <span className="divider" />
      <span className="date">XXI · VI · MMXXV</span>
    </LuxeContent>
  </LuxeBox>
);

// ============================================
// STYLES
// ============================================
const Section = styled.section`
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 600px) {
    padding: 140px 5%;
  }
  ${p => p.$themeId === 'video' && css`background: #FFFFFF;`}
  ${p => p.$themeId === 'editorial' && css`background: #FAFAFA;`}
  ${p => p.$themeId === 'botanical' && css`background: linear-gradient(180deg, #FAF9F6 0%, #F0EDE5 100%);`}
  ${p => p.$themeId === 'contemporary' && css`background: #FFFFFF;`}
  ${p => p.$themeId === 'luxe' && css`background: #FAF9F7;`}
  ${p => p.$themeId === 'neon' && css`background: #0a0a0f;`}
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.span`
  display: block;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  margin-bottom: 20px;
  ${p => p.$themeId === 'video' && css`font-family: 'Montserrat', sans-serif; color: #B8976A;`}
  ${p => p.$themeId === 'editorial' && css`font-family: 'Inter', sans-serif; color: #999;`}
  ${p => p.$themeId === 'botanical' && css`font-family: 'Lato', sans-serif; color: #7A9972;`}
  ${p => p.$themeId === 'contemporary' && css`font-family: 'Space Grotesk', sans-serif; color: #FF6B6B;`}
  ${p => p.$themeId === 'luxe' && css`font-family: 'Montserrat', sans-serif; color: #D4AF37;`}
  ${p => p.$themeId === 'neon' && css`font-family: 'Space Grotesk', sans-serif; color: #00ffff;`}
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  margin-bottom: 20px;
  ${p => p.$themeId === 'video' && css`font-family: 'Cormorant Garamond', Georgia, serif; color: #1A1A1A; font-style: italic;`}
  ${p => p.$themeId === 'editorial' && css`font-family: 'Instrument Serif', Georgia, serif; color: #1A1A1A; font-style: italic;`}
  ${p => p.$themeId === 'botanical' && css`font-family: 'Playfair Display', Georgia, serif; color: #2C3E2D; font-style: italic;`}
  ${p => p.$themeId === 'contemporary' && css`font-family: 'Space Grotesk', sans-serif; color: #0D0D0D; font-weight: 700;`}
  ${p => p.$themeId === 'luxe' && css`font-family: 'Cormorant Garamond', Georgia, serif; color: #2A2A2A; font-style: italic;`}
  ${p => p.$themeId === 'neon' && css`font-family: 'Space Grotesk', sans-serif; color: #FFFFFF; font-weight: 700;`}
`;

const Subtitle = styled.p`
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.8;
  ${p => p.$themeId === 'video' && css`font-family: 'Montserrat', sans-serif; color: rgba(26,26,26,0.6);`}
  ${p => p.$themeId === 'editorial' && css`font-family: 'Inter', sans-serif; color: #666;`}
  ${p => p.$themeId === 'botanical' && css`font-family: 'Lato', sans-serif; color: #6B7B6C;`}
  ${p => p.$themeId === 'contemporary' && css`font-family: 'Space Grotesk', sans-serif; color: #666;`}
  ${p => p.$themeId === 'luxe' && css`font-family: 'Montserrat', sans-serif; color: rgba(42,42,42,0.6);`}
  ${p => p.$themeId === 'neon' && css`font-family: 'Space Grotesk', sans-serif; color: rgba(255,255,255,0.5);`}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  
  @media (min-width: 600px) { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 30px;
  }
  @media (min-width: 1000px) { 
    grid-template-columns: repeat(3, 1fr); 
  }

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 0.5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const ThemeCard = styled.div`
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$delay}s;
  
  &:hover {
    transform: translateY(-8px);
  }

  @media (max-width: 768px) {
    flex: 0 0 80vw;
    max-width: 80vw;
    scroll-snap-align: center;
  }
`;

const PreviewWrapper = styled.div`
  height: 220px;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  
  @media (min-width: 600px) {
    height: 280px;
  }
`;

const CardInfo = styled.div`
  padding: 25px 20px;
  ${p => p.$themeId === 'video' && css`background: #FFFFFF; border: 1px solid rgba(184,151,106,0.15); border-top: none;`}
  ${p => p.$themeId === 'editorial' && css`background: #FFFFFF; border: 1px solid #E0E0E0; border-top: none;`}
  ${p => p.$themeId === 'botanical' && css`background: #FFFFFF; border: 1px solid rgba(139,157,131,0.2); border-top: none; border-radius: 0 0 16px 16px;`}
  ${p => p.$themeId === 'contemporary' && css`background: #FFFFFF; border: 3px solid #0D0D0D; border-top: none;`}
  ${p => p.$themeId === 'luxe' && css`background: #FFFFFF; border: 1px solid rgba(212,175,55,0.1); border-top: none;`}
  ${p => p.$themeId === 'neon' && css`background: rgba(255,255,255,0.02); border: 1px solid rgba(0,255,255,0.2); border-top: none;`}
`;

const CardName = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 5px;
  ${p => p.$themeId === 'video' && css`font-family: 'Cormorant Garamond', Georgia, serif; color: #1A1A1A;`}
  ${p => p.$themeId === 'editorial' && css`font-family: 'Instrument Serif', Georgia, serif; color: #1A1A1A;`}
  ${p => p.$themeId === 'botanical' && css`font-family: 'Playfair Display', Georgia, serif; color: #2D3B2D;`}
  ${p => p.$themeId === 'contemporary' && css`font-family: 'Space Grotesk', sans-serif; color: #0D0D0D; font-weight: 600;`}
  ${p => p.$themeId === 'luxe' && css`font-family: 'Cormorant Garamond', Georgia, serif; color: #2A2A2A;`}
  ${p => p.$themeId === 'neon' && css`font-family: 'Space Grotesk', sans-serif; color: #ffffff;`}
`;

const CardDesc = styled.p`
  font-size: 0.85rem;
  margin: 0 0 12px 0;
  ${p => p.$themeId === 'video' && css`font-family: 'Montserrat', sans-serif; color: rgba(26,26,26,0.5);`}
  ${p => p.$themeId === 'editorial' && css`font-family: 'Inter', sans-serif; color: #999;`}
  ${p => p.$themeId === 'botanical' && css`font-family: 'Lato', sans-serif; color: #7D9D7C;`}
  ${p => p.$themeId === 'contemporary' && css`font-family: 'Space Grotesk', sans-serif; color: #999;`}
  ${p => p.$themeId === 'luxe' && css`font-family: 'Montserrat', sans-serif; color: rgba(42,42,42,0.5);`}
  ${p => p.$themeId === 'neon' && css`font-family: 'Space Grotesk', sans-serif; color: rgba(255,255,255,0.4);`}
`;

const DemoLink = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 500;
  ${p => p.$themeId === 'video' && css`color: #B8976A;`}
  ${p => p.$themeId === 'editorial' && css`color: #1A1A1A;`}
  ${p => p.$themeId === 'botanical' && css`color: #7A9972;`}
  ${p => p.$themeId === 'contemporary' && css`color: #FF6B6B;`}
  ${p => p.$themeId === 'luxe' && css`color: #D4AF37;`}
  ${p => p.$themeId === 'neon' && css`color: #00ffff;`}
`;

// ============================================
// EDITORIAL PREVIEW STYLES
// ============================================
const EditorialBox = styled.div`
  width: 100%; height: 100%;
  background: #FFFFFF;
  display: flex; align-items: center; justify-content: center;
  position: relative;
`;

const EditorialLine = styled.div`
  position: absolute; height: 1px; background: #E0E0E0;
  ${p => p.$pos === 'top' && css`top: 12%; left: 8%; right: 8%;`}
  ${p => p.$pos === 'bottom' && css`bottom: 12%; left: 8%; right: 8%;`}
`;

const EditorialLineV = styled.div`
  position: absolute; width: 1px; background: #E0E0E0;
  ${p => p.$pos === 'left' && css`left: 8%; top: 12%; bottom: 12%;`}
  ${p => p.$pos === 'right' && css`right: 8%; top: 12%; bottom: 12%;`}
`;

const EditorialContent = styled.div`
  text-align: center;
  .eyebrow { display: block; font-family: 'Inter', sans-serif; font-size: 0.5rem; letter-spacing: 0.25em; color: #999; margin-bottom: 10px; }
  .names { display: block; font-family: 'Instrument Serif', Georgia, serif; font-size: 2rem; font-style: italic; color: #1A1A1A; margin-bottom: 6px; }
  .date { font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 0.15em; color: #666; }
  @media (min-width: 600px) {
    .eyebrow { font-size: 0.6rem; margin-bottom: 12px; }
    .names { font-size: 2.8rem; margin-bottom: 8px; }
    .date { font-size: 0.75rem; }
  }
`;

// ============================================
// BOTANICAL PREVIEW STYLES
// ============================================
const BotanicalBox = styled.div`
  width: 100%; height: 100%;
  background: linear-gradient(180deg, #FAF9F6 0%, #F0EDE5 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
`;

const BotanicalLeaf = styled.div`
  position: absolute; font-size: 1.8rem; opacity: 0.25;
  animation: ${float} 4s ease-in-out infinite;
  ${p => p.$pos === 'tl' && css`top: 8%; left: 6%;`}
  ${p => p.$pos === 'tr' && css`top: 12%; right: 8%; animation-delay: 0.5s;`}
  ${p => p.$pos === 'bl' && css`bottom: 12%; left: 10%; animation-delay: 1s;`}
  ${p => p.$pos === 'br' && css`bottom: 8%; right: 6%; animation-delay: 1.5s;`}
`;

const BotanicalContent = styled.div`
  text-align: center;
  .eyebrow { display: block; font-family: 'Lato', sans-serif; font-size: 0.55rem; letter-spacing: 0.25em; color: #7A9972; margin-bottom: 10px; }
  .names { display: block; font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-style: italic; color: #2C3E2D; margin-bottom: 6px; }
  .date { font-family: 'Lato', sans-serif; font-size: 0.65rem; letter-spacing: 0.12em; color: #6B7B6C; }
  @media (min-width: 600px) {
    .eyebrow { font-size: 0.65rem; margin-bottom: 12px; }
    .names { font-size: 2.8rem; margin-bottom: 8px; }
    .date { font-size: 0.75rem; }
  }
`;

// ============================================
// CONTEMPORARY PREVIEW STYLES
// ============================================
const ContemporaryBox = styled.div`
  width: 100%; height: 100%;
  background: #FAFAFA;
  display: flex;
  position: relative; overflow: hidden;
`;

const ContemporaryGradient = styled.div`
  position: absolute; right: 0; top: 0; bottom: 0; width: 40%;
  background: linear-gradient(160deg, #FF6B6B 0%, #4ECDC4 50%, #FFE66D 100%);
`;

const ContemporaryCircle = styled.div`
  position: absolute;
  width: ${p => p.$size}; height: ${p => p.$size};
  border-radius: 50%; background: ${p => p.$color}; opacity: 0.7;
  top: ${p => p.$top || 'auto'}; bottom: ${p => p.$bottom || 'auto'};
  left: ${p => p.$left || 'auto'}; right: ${p => p.$right || 'auto'};
`;

const ContemporarySquare = styled.div`
  position: absolute;
  width: ${p => p.$size}; height: ${p => p.$size};
  background: ${p => p.$color}; transform: rotate(12deg);
  top: ${p => p.$top || 'auto'}; bottom: ${p => p.$bottom || 'auto'};
  left: ${p => p.$left || 'auto'}; right: ${p => p.$right || 'auto'};
`;

const ContemporaryContent = styled.div`
  position: relative; z-index: 1;
  padding: 25px 20px;
  display: flex; flex-direction: column; justify-content: center;
  .date { font-family: 'Space Grotesk', sans-serif; font-size: 0.5rem; font-weight: 700; letter-spacing: 0.1em; color: #FFF; background: #0D0D0D; padding: 5px 10px; margin-bottom: 12px; align-self: flex-start; }
  .name1 { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #FF6B6B; line-height: 1; }
  .amp { font-size: 0.8rem; font-style: italic; color: #999; margin: 2px 0; }
  .name2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.4rem; font-weight: 700; color: #0D0D0D; line-height: 1; }
  @media (min-width: 600px) {
    padding: 35px 25px;
    .date { font-size: 0.6rem; padding: 6px 12px; margin-bottom: 15px; }
    .name1, .name2 { font-size: 1.8rem; }
    .amp { font-size: 1rem; margin: 3px 0; }
  }
`;

// ============================================
// NEON PREVIEW STYLES
// ============================================
const NeonBox = styled.div`
  width: 100%; height: 100%;
  background: #0a0a0f;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
`;

const NeonGrid = styled.div`
  position: absolute; inset: 0;
  background-image: 
    linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 30px 30px;
`;

const NeonFrame = styled.div`
  position: absolute; inset: 25px;
  border: 1px solid rgba(0,255,255,0.25);
  &::before, &::after { content: ''; position: absolute; width: 12px; height: 12px; border-color: #00ffff; border-style: solid; }
  &::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
  &::after { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }
`;

const NeonContent = styled.div`
  text-align: center; z-index: 1;
  .eyebrow { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 0.5rem; letter-spacing: 0.2em; color: #ff00ff; margin-bottom: 10px; }
  .names { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px; animation: ${neonGlow} 2s ease-in-out infinite; }
  .date { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; color: #00ffff; }
  @media (min-width: 600px) {
    .eyebrow { font-size: 0.6rem; margin-bottom: 12px; }
    .names { font-size: 3.5rem; margin-bottom: 8px; }
    .date { font-size: 0.8rem; }
  }
`;

// ============================================
// VIDEO PREVIEW STYLES
// ============================================
const VideoBox = styled.div`
  width: 100%; height: 100%;
  background: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative;
`;

const VideoOverlay = styled.div`
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%);
`;

const VideoContent = styled.div`
  text-align: center; z-index: 1;
  .eyebrow { display: block; font-family: 'Montserrat', sans-serif; font-size: 0.45rem; letter-spacing: 0.35em; color: #B8976A; margin-bottom: 12px; }
  .names { display: block; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 300; font-style: italic; color: #FFFFFF; margin-bottom: 10px; }
  .line { display: block; width: 30px; height: 1px; background: #B8976A; margin: 0 auto 10px; }
  .date { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255,255,255,0.6); }
  @media (min-width: 600px) {
    .eyebrow { font-size: 0.55rem; margin-bottom: 15px; }
    .names { font-size: 3rem; margin-bottom: 12px; }
    .line { width: 40px; margin: 0 auto 12px; }
    .date { font-size: 0.7rem; }
  }
`;

// ============================================
// LUXE PREVIEW STYLES
// ============================================
const LuxeBox = styled.div`
  width: 100%; height: 100%;
  background: #0A0A0A;
  display: flex; align-items: center; justify-content: center;
  position: relative;
`;

const LuxePattern = styled.div`
  position: absolute; inset: 0; opacity: 0.03;
  background-image: repeating-linear-gradient(45deg, #D4AF37 0px, #D4AF37 1px, transparent 1px, transparent 15px);
`;

const LuxeContent = styled.div`
  text-align: center; z-index: 1;
  .diamond { display: block; font-size: 0.8rem; color: #D4AF37; margin-bottom: 10px; }
  .names { display: block; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 300; font-style: italic; color: #D4AF37; margin-bottom: 8px; }
  .divider { display: block; width: 35px; height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 auto 10px; }
  .date { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 0.65rem; font-style: italic; letter-spacing: 0.2em; color: rgba(212,175,55,0.6); }
  @media (min-width: 600px) {
    .diamond { font-size: 1rem; margin-bottom: 12px; }
    .names { font-size: 3rem; margin-bottom: 10px; }
    .divider { width: 50px; margin: 0 auto 12px; }
    .date { font-size: 0.8rem; }
  }
`;
