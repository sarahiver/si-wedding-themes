import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 600px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const CodeBadge = styled.div`display: inline-block; padding: 1rem 2.5rem; border: 1px solid var(--video-accent); margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const CodeText = styled.span`font-family: var(--font-accent); font-size: 1.5rem; font-style: italic; color: var(--video-white);`;
const Palette = styled.div`display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.3s;`;
const Swatch = styled.div`text-align: center;`;
const Color = styled.div`width: 50px; height: 50px; background: ${p => p.$hex}; margin: 0 auto 0.5rem;`;
const ColorName = styled.span`font-family: var(--font-primary); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--video-gray);`;
const Guidelines = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; text-align: left; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.4s; @media (max-width: 500px) { grid-template-columns: 1fr; }`;
const GuideCol = styled.div``;
const GuideTitle = styled.h4`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: ${p => p.$type === 'do' ? 'var(--video-accent)' : 'var(--video-gray)'}; margin-bottom: 1rem;`;
const GuideList = styled.ul`list-style: none;`;
const GuideItem = styled.li`font-family: var(--font-primary); font-size: 0.85rem; color: var(--video-silver); padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);`;

function Dresscode() {
  const { content } = useWedding();
  const data = content?.dresscode || {};
  const title = data.title || 'Dresscode';
  const code = data.code || 'Black Tie Optional';
  const colors = data.colors || [{ name: 'Schwarz', hex: '#1A1A1A' }, { name: 'Navy', hex: '#1C2841' }, { name: 'Silber', hex: '#C0C0C0' }, { name: 'Creme', hex: '#F5F5DC' }];
  const dos = data.dos || ['Elegante Abendgarderobe', 'Dunkle Anzuege', 'Lange Kleider'];
  const donts = data.donts || ['Weiss (reserviert fuer Braut)', 'Jeans', 'Sneaker'];
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWrapper id="dresscode">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Was anziehen?</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <CodeBadge $visible={visible}><CodeText>{code}</CodeText></CodeBadge>
        <Palette $visible={visible}>
          {colors.map((c, i) => <Swatch key={i}><Color $hex={c.hex} /><ColorName>{c.name}</ColorName></Swatch>)}
        </Palette>
        <Guidelines $visible={visible}>
          <GuideCol>
            <GuideTitle $type="do">Empfohlen</GuideTitle>
            <GuideList>{dos.map((item, i) => <GuideItem key={i}>{item}</GuideItem>)}</GuideList>
          </GuideCol>
          <GuideCol>
            <GuideTitle $type="dont">Bitte vermeiden</GuideTitle>
            <GuideList>{donts.map((item, i) => <GuideItem key={i}>{item}</GuideItem>)}</GuideList>
          </GuideCol>
        </Guidelines>
      </Content>
    </SectionWrapper>
  );
}

export default Dresscode;
