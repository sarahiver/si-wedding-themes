import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeInUp = keyframes\`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }\`;
const lineGrow = keyframes\`from { transform: scaleX(0); } to { transform: scaleX(1); }\`;

const Section = styled.section\`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: \${p => p.$bg || 'var(--classic-white)'};\`;
const Container = styled.div\`max-width: \${p => p.$w || 'var(--content-width)'}; margin: 0 auto;\`;
const Header = styled.div\`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);\`;
const Eyebrow = styled.p\`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; \${p => p.$v && css\`animation: \${fadeInUp} 0.8s ease forwards;\`}\`;
const Title = styled.h2\`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; \${p => p.$v && css\`animation: \${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;\`}\`;
const Desc = styled.p\`font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); margin-top: 1rem; max-width: 550px; margin-left: auto; margin-right: auto; opacity: 0; \${p => p.$v && css\`animation: \${fadeInUp} 0.8s ease forwards; animation-delay: 0.25s;\`}\`;
const Content = styled.div\`max-width: 650px; margin: 0 auto; text-align: center; opacity: 0; ${p => p.$v && css\`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.3s;\`}\`;
const DressText = styled.p\`font-family: var(--font-display); font-size: 1.3rem; font-style: italic; font-weight: 300; color: var(--classic-text); line-height: 1.8;\`;
const ColorRow = styled.div\`display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; flex-wrap: wrap;\`;
const ColorSwatch = styled.div\`width: 40px; height: 40px; border-radius: 50%; background: ${p => p.$color}; border: 1px solid var(--classic-beige); box-shadow: 0 2px 8px rgba(0,0,0,0.08);\`;

function Dresscode() {
  const { content } = useWedding();
  const dc = content?.dresscode || {};
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = dc.title || 'Dresscode';
  const text = dc.description || 'Wir freuen uns über elegante Garderobe in gedeckten Farben.';
  const colors = dc.colors || ['#2C2C2C','#F5F0EB','#C4A87C','#8B7355','#D4C5B5'];
  return (
    <Section id="dresscode" $bg="var(--classic-cream)" ref={ref}>
      <Container $w="800px">
        <Header><Eyebrow $v={visible}>Kleiderordnung</Eyebrow><Title $v={visible}>{title}</Title></Header>
        <Content $v={visible}><DressText>{text}</DressText><ColorRow>{colors.map((c,i) => <ColorSwatch key={i} $color={c} />)}</ColorRow></Content>
      </Container>
    </Section>
  );
}
export default Dresscode;