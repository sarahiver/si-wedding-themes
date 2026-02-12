// src/components/marketing/HowItWorks.js
import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const neonPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(0,255,255,0.5); }
  50% { box-shadow: 0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4); }
`;

// Steps Data
const steps = [
  { num: '01', title: 'Anfrage senden', desc: 'Erzählt uns von eurer Hochzeit und euren Wünschen' },
  { num: '02', title: 'Design wählen', desc: 'Wählt euer Lieblingsdesign aus unseren einzigartigen Themes' },
  { num: '03', title: 'Inhalte liefern', desc: 'Füllt das Formular mit euren Texten und Bildern aus' },
  { num: '04', title: 'Website live!', desc: 'Eure Traumwebsite geht online – bereit für eure Gäste' },
];

function HowItWorks() {
  const { currentTheme } = useTheme();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const renderContent = () => {
    switch(currentTheme) {
      case 'editorial': return <EditorialLayout steps={steps} isVisible={isVisible} />;
      case 'contemporary': return <ContemporaryLayout steps={steps} isVisible={isVisible} />;
      case 'botanical': return <BotanicalLayout steps={steps} isVisible={isVisible} />;
      case 'neon': return <NeonLayout steps={steps} isVisible={isVisible} />;
      case 'video': return <VideoLayout steps={steps} isVisible={isVisible} />;
      case 'luxe': return <LuxeLayout steps={steps} isVisible={isVisible} />;
      default: return <EditorialLayout steps={steps} isVisible={isVisible} />;
    }
  };

  return (
    <Section ref={sectionRef} $themeId={currentTheme}>
      {renderContent()}
    </Section>
  );
}

// EDITORIAL LAYOUT - Vertikale Timeline
const EditorialLayout = ({ steps, isVisible }) => (
  <EditorialContainer>
    <EditorialHeader $visible={isVisible}>
      <EditorialEyebrow>— So funktioniert's —</EditorialEyebrow>
      <EditorialTitle>4 Schritte zur Traumwebsite</EditorialTitle>
    </EditorialHeader>
    <EditorialTimeline>
      <EditorialTimelineLine $visible={isVisible} />
      {steps.map((step, i) => (
        <EditorialStep key={step.num} $visible={isVisible} $delay={0.3 + i * 0.2}>
          <EditorialStepNumber>{step.num}</EditorialStepNumber>
          <EditorialStepLine />
          <EditorialStepContent>
            <EditorialStepTitle>{step.title}</EditorialStepTitle>
            <EditorialStepDesc>{step.desc}</EditorialStepDesc>
          </EditorialStepContent>
        </EditorialStep>
      ))}
    </EditorialTimeline>
  </EditorialContainer>
);

// CONTEMPORARY LAYOUT - Gestaffelte bunte Karten
const ContemporaryLayout = ({ steps, isVisible }) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF6B6B'];
  return (
    <ContemporaryContainer>
      <ContemporaryHeader $visible={isVisible}>
        <ContemporaryBadge>4 EASY STEPS</ContemporaryBadge>
        <ContemporaryTitle>SO EINFACH GEHT'S.</ContemporaryTitle>
      </ContemporaryHeader>
      <ContemporaryShapes>
        <ContemporaryCircle $top="15%" $right="10%" $size="80px" $color="#FF6B6B" />
        <ContemporaryCircle $top="45%" $left="5%" $size="50px" $color="#4ECDC4" />
        <ContemporaryDiamond $bottom="25%" $right="8%" $size="40px" $color="#FFE66D" />
        <ContemporarySquare $bottom="15%" $left="12%" $size="35px" />
      </ContemporaryShapes>
      <ContemporarySteps>
        {steps.map((step, i) => (
          <ContemporaryStep key={step.num} $visible={isVisible} $delay={0.2 + i * 0.15} $align={i % 2 === 0 ? 'left' : 'right'}>
            <ContemporaryCard $shadowColor={colors[i]}>
              <ContemporaryCardNumber $color={colors[i]}>{step.num}</ContemporaryCardNumber>
              <ContemporaryCardTitle>{step.title}</ContemporaryCardTitle>
              <ContemporaryCardDesc>{step.desc}</ContemporaryCardDesc>
            </ContemporaryCard>
          </ContemporaryStep>
        ))}
      </ContemporarySteps>
    </ContemporaryContainer>
  );
};

// BOTANICAL LAYOUT - Organischer Pfad
const BotanicalLayout = ({ steps, isVisible }) => (
  <BotanicalContainer>
    <BotanicalLeaves>
      <BotanicalLeaf $top="5%" $left="5%" $delay="0s">🌿</BotanicalLeaf>
      <BotanicalLeaf $top="30%" $right="3%" $delay="0.5s">🍃</BotanicalLeaf>
      <BotanicalLeaf $bottom="25%" $left="8%" $delay="1s">🌱</BotanicalLeaf>
      <BotanicalLeaf $bottom="10%" $right="10%" $delay="1.5s">🌸</BotanicalLeaf>
    </BotanicalLeaves>
    <BotanicalHeader $visible={isVisible}>
      <BotanicalEyebrow>✿ Euer Weg ✿</BotanicalEyebrow>
      <BotanicalTitle>Der Weg zur Traumwebsite</BotanicalTitle>
    </BotanicalHeader>
    <BotanicalPath>
      {steps.map((step, i) => (
        <BotanicalStep key={step.num} $visible={isVisible} $delay={0.3 + i * 0.2} $index={i}>
          <BotanicalStepCircle>
            <BotanicalStepNumber>{step.num}</BotanicalStepNumber>
          </BotanicalStepCircle>
          <BotanicalStepContent $align={i % 2 === 0 ? 'left' : 'right'}>
            <BotanicalStepTitle>{step.title}</BotanicalStepTitle>
            <BotanicalStepDesc>{step.desc}</BotanicalStepDesc>
          </BotanicalStepContent>
          {i < steps.length - 1 && <BotanicalConnector $visible={isVisible} $delay={0.5 + i * 0.2} />}
        </BotanicalStep>
      ))}
    </BotanicalPath>
  </BotanicalContainer>
);

// NEON LAYOUT - Terminal Commands
const NeonLayout = ({ steps, isVisible }) => (
  <NeonContainer>
    <NeonTerminal $visible={isVisible}>
      <NeonTerminalHeader>
        <NeonTerminalDot $color="#ff5f56" />
        <NeonTerminalDot $color="#ffbd2e" />
        <NeonTerminalDot $color="#27ca40" />
        <NeonTerminalTitle>wedding_setup.exe</NeonTerminalTitle>
      </NeonTerminalHeader>
      <NeonTerminalBody>
        <NeonTypingLine $visible={isVisible} $delay="0.3s">
          <span>&gt;</span> INITIALIZING WEDDING_WEBSITE.exe...
        </NeonTypingLine>
        <NeonTypingLine $visible={isVisible} $delay="0.8s">
          <span>&gt;</span> LOADING MODULES...
        </NeonTypingLine>
        <NeonStepsContainer>
          {steps.map((step, i) => (
            <NeonStep key={step.num} $visible={isVisible} $delay={1.2 + i * 0.3}>
              <NeonStepHeader>
                <NeonStepBracket>[{step.num}]</NeonStepBracket>
                <NeonStepCommand>&gt; {step.title.toUpperCase().replace(' ', '_')}</NeonStepCommand>
              </NeonStepHeader>
              <NeonProgressBar>
                <NeonProgressFill $visible={isVisible} $delay={1.4 + i * 0.3} />
              </NeonProgressBar>
              <NeonStepDesc>{step.desc}</NeonStepDesc>
            </NeonStep>
          ))}
        </NeonStepsContainer>
        <NeonTypingLine $visible={isVisible} $delay="2.8s">
          <span>&gt;</span> SYSTEM READY. WEDDING MODE ACTIVATED<NeonCursor>_</NeonCursor>
        </NeonTypingLine>
      </NeonTerminalBody>
    </NeonTerminal>
  </NeonContainer>
);

// VIDEO LAYOUT - Elegant Horizontal Cards (hell, kein Filmstreifen)
const VideoLayout = ({ steps, isVisible }) => (
  <VideoContainer>
    <VideoHeader $visible={isVisible}>
      <VideoEyebrow>— So funktioniert's —</VideoEyebrow>
      <VideoTitle>4 Schritte zur Traumwebsite</VideoTitle>
    </VideoHeader>
    <VideoSteps>
      {steps.map((step, i) => (
        <VideoStep key={step.num} $visible={isVisible} $delay={0.2 + i * 0.15}>
          <VideoStepNumber>{step.num}</VideoStepNumber>
          <VideoStepContent>
            <VideoStepTitle>{step.title}</VideoStepTitle>
            <VideoStepDesc>{step.desc}</VideoStepDesc>
          </VideoStepContent>
        </VideoStep>
      ))}
    </VideoSteps>
    <VideoGoldLine $visible={isVisible} />
  </VideoContainer>
);

// LUXE LAYOUT - Elegante Liste mit Diamanten
const LuxeLayout = ({ steps, isVisible }) => {
  const romanNumerals = ['I', 'II', 'III', 'IV'];
  return (
    <LuxeContainer>
      <LuxeHeader $visible={isVisible}>
        <LuxeDiamond>✦</LuxeDiamond>
        <LuxeEyebrow>DER PROZESS</LuxeEyebrow>
        <LuxeTitle>Der Weg zu Ihrer Traumwebsite</LuxeTitle>
      </LuxeHeader>
      <LuxeSteps>
        {steps.map((step, i) => (
          <React.Fragment key={step.num}>
            <LuxeDivider $visible={isVisible} $delay={0.2 + i * 0.15} />
            <LuxeStep $visible={isVisible} $delay={0.3 + i * 0.15}>
              <LuxeStepNumber><span>✦</span> {romanNumerals[i]} <span>✦</span></LuxeStepNumber>
              <LuxeStepTitle>{step.title.toUpperCase()}</LuxeStepTitle>
              <LuxeStepDesc>{step.desc}</LuxeStepDesc>
            </LuxeStep>
          </React.Fragment>
        ))}
        <LuxeDivider $visible={isVisible} $delay={0.9} />
      </LuxeSteps>
      <LuxeFooterDiamond $visible={isVisible}>✦</LuxeFooterDiamond>
    </LuxeContainer>
  );
};

export default HowItWorks;

// STYLES
const Section = styled.section`
  padding: 100px 20px;
  @media (min-width: 600px) { padding: 140px 5%; }
  position: relative;
  overflow: hidden;
  ${p => p.$themeId === 'editorial' && css`background: #FAFAFA;`}
  ${p => p.$themeId === 'contemporary' && css`background: #FFFFFF;`}
  ${p => p.$themeId === 'botanical' && css`background: linear-gradient(180deg, #F5F1EB 0%, #FAF9F6 100%);`}
  ${p => p.$themeId === 'neon' && css`background: #0a0a0f;`}
  ${p => p.$themeId === 'video' && css`background: #FFFFFF;`}
  ${p => p.$themeId === 'luxe' && css`background: #FFFFFF;`}
`;

// EDITORIAL STYLES
const EditorialContainer = styled.div`max-width: 800px; margin: 0 auto; width: 100%;`;
const EditorialHeader = styled.div`text-align: center; margin-bottom: 60px; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.8s ease; @media (min-width: 600px) { margin-bottom: 80px; }`;
const EditorialEyebrow = styled.span`display: block; font-family: 'Inter', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; color: #999; margin-bottom: 20px;`;
const EditorialTitle = styled.h2`font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 400; font-style: italic; color: #1A1A1A;`;
const EditorialTimeline = styled.div`position: relative; padding-left: 50px; @media (min-width: 600px) { padding-left: 100px; }`;
const EditorialTimelineLine = styled.div`position: absolute; left: 18px; top: 0; bottom: 0; width: 1px; background: #E0E0E0; &::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: ${p => p.$visible ? '100%' : '0'}; background: #1A1A1A; transition: height 1.5s ease; } @media (min-width: 600px) { left: 35px; }`;
const EditorialStep = styled.div`position: relative; padding: 25px 0; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '20px'}); transition: all 0.6s ease; transition-delay: ${p => p.$delay}s; @media (min-width: 600px) { padding: 30px 0; }`;
const EditorialStepNumber = styled.div`position: absolute; left: -50px; top: 25px; font-family: 'Instrument Serif', Georgia, serif; font-size: 1.6rem; font-style: italic; color: #1A1A1A; @media (min-width: 600px) { left: -100px; top: 30px; font-size: 2.5rem; }`;
const EditorialStepLine = styled.div`position: absolute; left: -32px; top: 38px; width: 15px; height: 1px; background: #CCC; @media (min-width: 600px) { left: -65px; top: 50px; width: 30px; }`;
const EditorialStepContent = styled.div``;
const EditorialStepTitle = styled.h3`font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 500; color: #1A1A1A; margin-bottom: 8px;`;
const EditorialStepDesc = styled.p`font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.7; margin: 0;`;

// CONTEMPORARY STYLES
const ContemporaryContainer = styled.div`max-width: 900px; margin: 0 auto; position: relative;`;
const ContemporaryHeader = styled.div`text-align: center; margin-bottom: 60px; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.8s ease;`;
const ContemporaryBadge = styled.div`display: inline-block; font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; color: #FFFFFF; background: #FF6B6B; padding: 10px 20px; margin-bottom: 25px;`;
const ContemporaryTitle = styled.h2`font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; color: #0D0D0D;`;
const ContemporaryShapes = styled.div`position: absolute; inset: 0; pointer-events: none; z-index: 0;`;
const ContemporaryCircle = styled.div`position: absolute; width: ${p => p.$size}; height: ${p => p.$size}; border-radius: 50%; background: ${p => p.$color}; opacity: 0.6; top: ${p => p.$top || 'auto'}; bottom: ${p => p.$bottom || 'auto'}; left: ${p => p.$left || 'auto'}; right: ${p => p.$right || 'auto'}; animation: ${float} 6s ease-in-out infinite;`;
const ContemporaryDiamond = styled.div`position: absolute; width: ${p => p.$size}; height: ${p => p.$size}; background: ${p => p.$color}; transform: rotate(45deg); top: ${p => p.$top || 'auto'}; bottom: ${p => p.$bottom || 'auto'}; left: ${p => p.$left || 'auto'}; right: ${p => p.$right || 'auto'}; animation: ${float} 7s ease-in-out infinite reverse;`;
const ContemporarySquare = styled.div`position: absolute; width: ${p => p.$size}; height: ${p => p.$size}; border: 3px solid #0D0D0D; top: ${p => p.$top || 'auto'}; bottom: ${p => p.$bottom || 'auto'}; left: ${p => p.$left || 'auto'}; right: ${p => p.$right || 'auto'}; animation: ${float} 8s ease-in-out infinite;`;
const ContemporarySteps = styled.div`position: relative; z-index: 1; display: flex; flex-direction: column; gap: 30px;`;
const ContemporaryStep = styled.div`
  display: flex; 
  justify-content: ${p => p.$align === 'left' ? 'flex-start' : 'flex-end'}; 
  opacity: ${p => p.$visible ? 1 : 0}; 
  transform: translateY(${p => p.$visible ? 0 : '30px'}); 
  transition: all 0.6s ease; 
  transition-delay: ${p => p.$delay}s; 
  @media (max-width: 600px) { justify-content: center; }
`;
const ContemporaryCard = styled.div`background: #FFFFFF; border: 3px solid #0D0D0D; padding: 25px; max-width: 400px; width: 100%; transition: all 0.3s ease; box-shadow: 6px 6px 0 ${p => p.$shadowColor}; &:hover { transform: translate(-4px, -4px); box-shadow: 10px 10px 0 ${p => p.$shadowColor}; } @media (max-width: 600px) { max-width: 100%; }`;
const ContemporaryCardNumber = styled.div`font-family: 'Space Grotesk', sans-serif; font-size: 3rem; font-weight: 700; color: ${p => p.$color}; line-height: 1; margin-bottom: 15px;`;
const ContemporaryCardTitle = styled.h3`font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; color: #0D0D0D; margin-bottom: 10px;`;
const ContemporaryCardDesc = styled.p`font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; color: #666; line-height: 1.6; margin: 0;`;

// BOTANICAL STYLES
const BotanicalContainer = styled.div`max-width: 900px; margin: 0 auto; position: relative;`;
const BotanicalLeaves = styled.div`position: absolute; inset: 0; pointer-events: none; z-index: 0;`;
const BotanicalLeaf = styled.div`position: absolute; font-size: 2.5rem; opacity: 0.2; animation: ${float} 5s ease-in-out infinite; animation-delay: ${p => p.$delay}; top: ${p => p.$top || 'auto'}; bottom: ${p => p.$bottom || 'auto'}; left: ${p => p.$left || 'auto'}; right: ${p => p.$right || 'auto'};`;
const BotanicalHeader = styled.div`text-align: center; margin-bottom: 80px; position: relative; z-index: 1; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.8s ease;`;
const BotanicalEyebrow = styled.span`display: block; font-family: 'Lato', sans-serif; font-size: 0.75rem; letter-spacing: 0.4em; color: #7A9972; margin-bottom: 20px;`;
const BotanicalTitle = styled.h2`font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 400; font-style: italic; color: #2C3E2D;`;
const BotanicalPath = styled.div`position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 20px;`;
const BotanicalStep = styled.div`display: flex; align-items: center; gap: 30px; width: 100%; max-width: 600px; flex-direction: ${p => p.$index % 2 === 0 ? 'row' : 'row-reverse'}; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '20px'}); transition: all 0.6s ease; transition-delay: ${p => p.$delay}s; position: relative; @media (max-width: 600px) { flex-direction: row; }`;
const BotanicalStepCircle = styled.div`width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.9); border: 2px solid #7A9972; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 10px 30px rgba(122, 153, 114, 0.15);`;
const BotanicalStepNumber = styled.span`font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; font-style: italic; color: #7A9972;`;
const BotanicalStepContent = styled.div`flex: 1; text-align: ${p => p.$align}; @media (max-width: 600px) { text-align: left; }`;
const BotanicalStepTitle = styled.h3`font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 500; color: #2C3E2D; margin-bottom: 8px;`;
const BotanicalStepDesc = styled.p`font-family: 'Lato', sans-serif; font-size: 0.9rem; color: #6B7B6C; line-height: 1.7; margin: 0;`;
const BotanicalConnector = styled.div`position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); width: 2px; height: 20px; background: repeating-linear-gradient(to bottom, #7A9972 0px, #7A9972 4px, transparent 4px, transparent 8px); opacity: ${p => p.$visible ? 0.5 : 0}; transition: opacity 0.6s ease; transition-delay: ${p => p.$delay}s;`;

// NEON STYLES
const NeonContainer = styled.div`max-width: 800px; margin: 0 auto;`;
const NeonTerminal = styled.div`background: #0D0D12; border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px; overflow: hidden; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.8s ease;`;
const NeonTerminalHeader = styled.div`display: flex; align-items: center; gap: 8px; padding: 15px 20px; background: #1A1A22; border-bottom: 1px solid rgba(0, 255, 255, 0.2);`;
const NeonTerminalDot = styled.div`width: 12px; height: 12px; border-radius: 50%; background: ${p => p.$color};`;
const NeonTerminalTitle = styled.span`font-family: 'Space Grotesk', monospace; font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); margin-left: 15px;`;
const NeonTerminalBody = styled.div`padding: 30px;`;
const NeonTypingLine = styled.div`font-family: 'Space Grotesk', monospace; font-size: 0.85rem; color: #00ffff; margin-bottom: 20px; opacity: ${p => p.$visible ? 1 : 0}; transition: opacity 0.5s ease; transition-delay: ${p => p.$delay}; span { color: #ff00ff; }`;
const NeonCursor = styled.span`animation: ${blink} 1s infinite;`;
const NeonStepsContainer = styled.div`display: flex; flex-direction: column; gap: 25px; margin: 30px 0;`;
const NeonStep = styled.div`opacity: ${p => p.$visible ? 1 : 0}; transform: translateX(${p => p.$visible ? 0 : '-20px'}); transition: all 0.5s ease; transition-delay: ${p => p.$delay}s;`;
const NeonStepHeader = styled.div`display: flex; align-items: center; gap: 15px; margin-bottom: 10px;`;
const NeonStepBracket = styled.span`font-family: 'Space Grotesk', monospace; font-size: 0.9rem; color: #ff00ff;`;
const NeonStepCommand = styled.span`font-family: 'Space Grotesk', monospace; font-size: 0.9rem; color: #FFFFFF;`;
const NeonProgressBar = styled.div`height: 4px; background: rgba(0, 255, 255, 0.1); border-radius: 2px; margin-bottom: 10px; overflow: hidden;`;
const NeonProgressFill = styled.div`height: 100%; background: linear-gradient(90deg, #00ffff, #ff00ff); width: ${p => p.$visible ? '100%' : '0'}; transition: width 0.8s ease; transition-delay: ${p => p.$delay}s; box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);`;
const NeonStepDesc = styled.p`font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); margin: 0; padding-left: 50px;`;

// VIDEO STYLES - Elegant (hell, kein Filmstreifen)
const VideoContainer = styled.div`max-width: 1000px; margin: 0 auto;`;
const VideoHeader = styled.div`text-align: center; margin-bottom: 80px; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.8s ease;`;
const VideoEyebrow = styled.span`display: block; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; color: #B8976A; margin-bottom: 20px;`;
const VideoTitle = styled.h2`font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: #1A1A1A;`;
const VideoSteps = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 500px) { grid-template-columns: 1fr; } @media (max-width: 768px) { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 1rem; scrollbar-width: none; &::-webkit-scrollbar { display: none; } }`;
const VideoStep = styled.div`@media (max-width: 768px) { flex: 0 0 80vw; max-width: 80vw; scroll-snap-align: center; } text-align: center; padding: 40px 25px; border: 1px solid rgba(184, 151, 106, 0.2); opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.6s ease; transition-delay: ${p => p.$delay}s; &:hover { border-color: #B8976A; box-shadow: 0 15px 40px rgba(184, 151, 106, 0.1); }`;
const VideoStepNumber = styled.div`font-family: 'Cormorant Garamond', Georgia, serif; font-size: 3rem; font-weight: 300; font-style: italic; color: #B8976A; margin-bottom: 20px; line-height: 1;`;
const VideoStepContent = styled.div``;
const VideoStepTitle = styled.h3`font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.3rem; font-weight: 500; font-style: italic; color: #1A1A1A; margin-bottom: 12px;`;
const VideoStepDesc = styled.p`font-family: 'Montserrat', sans-serif; font-size: 0.8rem; color: rgba(26, 26, 26, 0.6); line-height: 1.7; margin: 0;`;
const VideoGoldLine = styled.div`height: 1px; background: linear-gradient(90deg, transparent, rgba(184, 151, 106, 0.3), transparent); margin-top: 80px; opacity: ${p => p.$visible ? 1 : 0}; transition: opacity 1s ease; transition-delay: 1s;`;

// LUXE STYLES
const LuxeContainer = styled.div`max-width: 700px; margin: 0 auto; text-align: center;`;
const LuxeHeader = styled.div`margin-bottom: 60px; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '30px'}); transition: all 0.8s ease;`;
const LuxeDiamond = styled.div`font-size: 1.5rem; color: #D4AF37; margin-bottom: 25px;`;
const LuxeEyebrow = styled.span`display: block; font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; color: #D4AF37; margin-bottom: 20px;`;
const LuxeTitle = styled.h2`font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 300; font-style: italic; color: #2A2A2A;`;
const LuxeSteps = styled.div``;
const LuxeDivider = styled.div`height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); opacity: ${p => p.$visible ? 0.3 : 0}; transition: opacity 0.8s ease; transition-delay: ${p => p.$delay}s;`;
const LuxeStep = styled.div`padding: 50px 20px; opacity: ${p => p.$visible ? 1 : 0}; transform: translateY(${p => p.$visible ? 0 : '20px'}); transition: all 0.6s ease; transition-delay: ${p => p.$delay}s;`;
const LuxeStepNumber = styled.div`font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.2rem; font-style: italic; color: #D4AF37; margin-bottom: 20px; span { font-size: 0.8rem; }`;
const LuxeStepTitle = styled.h3`font-family: 'Montserrat', sans-serif; font-size: 0.9rem; font-weight: 400; letter-spacing: 0.3em; color: #2A2A2A; margin-bottom: 15px;`;
const LuxeStepDesc = styled.p`font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.1rem; font-style: italic; color: rgba(42, 42, 42, 0.6); line-height: 1.8; margin: 0; max-width: 450px; margin: 0 auto;`;
const LuxeFooterDiamond = styled.div`font-size: 1.5rem; color: #D4AF37; margin-top: 20px; opacity: ${p => p.$visible ? 1 : 0}; transition: opacity 0.8s ease; transition-delay: 1.2s;`;
