// Luxe Dresscode
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-white);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const CodeBadge = styled.div`text-align: center; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s;`;
const CodeText = styled.span`font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: var(--luxe-gold); padding: 0.5rem 1.5rem; border: 1px solid var(--luxe-gold);`;

const ColorPalette = styled.div`display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.3s;`;
const ColorSwatch = styled.div`text-align: center;`;
const Color = styled.div`width: 60px; height: 60px; background: ${p => p.$color}; border: 1px solid var(--luxe-sand); margin-bottom: 0.5rem;`;
const ColorName = styled.span`font-family: var(--font-sans); font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--luxe-charcoal);`;

const Guidelines = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.4s; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const GuidelineSection = styled.div``;
const GuidelineTitle = styled.h4`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: ${p => p.$type === 'do' ? 'var(--luxe-olive)' : 'var(--luxe-taupe)'}; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--luxe-sand);`;
const GuidelineList = styled.ul`list-style: none;`;
const GuidelineItem = styled.li`font-family: var(--font-sans); font-size: 0.85rem; color: var(--luxe-charcoal); padding: 0.5rem 0; padding-left: 1.5rem; position: relative; &::before { content: '${p => p.$type === 'do' ? '✓' : '×'}'; position: absolute; left: 0; color: ${p => p.$type === 'do' ? 'var(--luxe-olive)' : 'var(--luxe-taupe)'}; }`;

function Dresscode() {
  const { content } = useWedding();
  const data = content?.dresscode || {};
  const title = data.title || 'Dresscode';
  const code = data.code || 'Elegant Festlich';
  const colors = data.colors || [{ name: 'Salbei', hex: '#A4A78B' }, { name: 'Taupe', hex: '#C4B7A6' }, { name: 'Creme', hex: '#F5F1EB' }, { name: 'Anthrazit', hex: '#3D3D3D' }];
  const dos = data.dos || ['Elegante Abendgarderobe', 'Gedeckte, warme Farben', 'Accessoires in Gold'];
  const donts = data.donts || ['Weiss oder Creme', 'Sehr laute Farben', 'Casual Kleidung'];
  
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
        <Header $visible={visible}><Eyebrow>Was ihr anziehen koennt</Eyebrow><Title>{title}</Title></Header>
        <CodeBadge $visible={visible}><CodeText>{code}</CodeText></CodeBadge>
        <ColorPalette $visible={visible}>
          {colors.map((c, i) => <ColorSwatch key={i}><Color $color={c.hex} /><ColorName>{c.name}</ColorName></ColorSwatch>)}
        </ColorPalette>
        <Guidelines $visible={visible}>
          <GuidelineSection>
            <GuidelineTitle $type="do">Empfohlen</GuidelineTitle>
            <GuidelineList>{dos.map((item, i) => <GuidelineItem key={i} $type="do">{item}</GuidelineItem>)}</GuidelineList>
          </GuidelineSection>
          <GuidelineSection>
            <GuidelineTitle $type="dont">Bitte vermeiden</GuidelineTitle>
            <GuidelineList>{donts.map((item, i) => <GuidelineItem key={i} $type="dont">{item}</GuidelineItem>)}</GuidelineList>
          </GuidelineSection>
        </Guidelines>
      </Container>
    </Section>
  );
}

export default Dresscode;
