// Luxe Dresscode
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-anthracite);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const CodeBadge = styled.div`display: inline-block; padding: 0.75rem 2rem; border: 1px solid var(--luxe-gold); margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const CodeText = styled.span`font-family: var(--font-display); font-size: 1.25rem; font-style: italic; color: var(--luxe-gold);`;

const Palette = styled.div`display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.3s;`;
const Swatch = styled.div`text-align: center;`;
const Color = styled.div`width: 50px; height: 50px; background: ${p => p.$hex}; margin-bottom: 0.5rem;`;
const ColorName = styled.span`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-pearl);`;

const Guidelines = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; text-align: left; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.4s; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const GuideSection = styled.div``;
const GuideTitle = styled.h4`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: ${p => p.$type === 'do' ? 'var(--luxe-gold)' : 'var(--luxe-slate)'}; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--luxe-charcoal);`;
const GuideList = styled.ul`list-style: none;`;
const GuideItem = styled.li`font-family: var(--font-body); font-size: 0.85rem; color: var(--luxe-pearl); padding: 0.5rem 0 0.5rem 1.5rem; position: relative; &::before { content: '${p => p.$type === 'do' ? '✓' : '×'}'; position: absolute; left: 0; color: ${p => p.$type === 'do' ? 'var(--luxe-gold)' : 'var(--luxe-slate)'}; }`;

function Dresscode() {
  const { content } = useWedding();
  const data = content?.dresscode || {};
  const title = data.title || 'Dresscode';
  const code = data.code || 'Black Tie Optional';

  const defaultColors = [{ name: 'Champagner', hex: '#D4AF37' }, { name: 'Elfenbein', hex: '#FFFFF0' }, { name: 'Salbei', hex: '#9CAF88' }, { name: 'Anthrazit', hex: '#2D2D30' }];
  const defaultDos = ['Elegante Abendgarderobe', 'Gedeckte, warme Farben', 'Accessoires in Gold'];
  const defaultDonts = ['Weiss oder Creme', 'Sehr laute Farben', 'Casual Kleidung'];

  // Support both old format (string) and new format (object with hex/name)
  const rawColors = Array.isArray(data.colors) && data.colors.length > 0 ? data.colors : defaultColors;
  const colors = rawColors.map(c => typeof c === 'string' ? { hex: c, name: '' } : { hex: c?.hex || '#888', name: c?.name || '' });
  const dos = Array.isArray(data.dos) && data.dos.length > 0 ? data.dos : defaultDos;
  const donts = Array.isArray(data.donts) && data.donts.length > 0 ? data.donts : defaultDonts;
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Section ref={sectionRef} id="dresscode">
      <Container>
        <Eyebrow $visible={visible}>Was ihr anziehen koennt</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <CodeBadge $visible={visible}><CodeText>{code}</CodeText></CodeBadge>
        <Palette $visible={visible}>{colors.map((c, i) => <Swatch key={i}><Color $hex={c.hex} />{c.name && <ColorName>{c.name}</ColorName>}</Swatch>)}</Palette>
        <Guidelines $visible={visible}>
          <GuideSection><GuideTitle $type="do">Empfohlen</GuideTitle><GuideList>{dos.map((item, i) => <GuideItem key={i} $type="do">{item}</GuideItem>)}</GuideList></GuideSection>
          <GuideSection><GuideTitle $type="dont">Bitte vermeiden</GuideTitle><GuideList>{donts.map((item, i) => <GuideItem key={i} $type="dont">{item}</GuideItem>)}</GuideList></GuideSection>
        </Guidelines>
      </Container>
    </Section>
  );
}

export default Dresscode;
