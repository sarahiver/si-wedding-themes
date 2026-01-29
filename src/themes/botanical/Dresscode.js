import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: linear-gradient(180deg, var(--botanical-mint) 0%, var(--botanical-cream) 100%);`;
const Container = styled.div`max-width: 700px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const CodeBadge = styled.div`display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: white; border-radius: 50px; box-shadow: 0 4px 20px rgba(107, 127, 94, 0.15); margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s;`;
const CodeIcon = styled.span`font-size: 1.5rem; animation: ${float} 2s ease-in-out infinite;`;
const CodeText = styled.span`font-family: var(--font-handwritten); font-size: 1.5rem; color: var(--botanical-forest);`;

const Palette = styled.div`display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.3s;`;
const Swatch = styled.div`text-align: center;`;
const Color = styled.div`width: 50px; height: 50px; background: ${p => p.$hex}; border-radius: 50%; margin: 0 auto 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);`;
const ColorName = styled.span`font-family: var(--font-body); font-size: 0.65rem; font-weight: 500; color: var(--botanical-brown);`;

const Guidelines = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.4s; @media (max-width: 600px) { grid-template-columns: 1fr; }`;
const GuideCard = styled.div`background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(107, 127, 94, 0.1);`;
const GuideTitle = styled.h4`font-family: var(--font-handwritten); font-size: 1.25rem; color: ${p => p.$type === 'do' ? 'var(--botanical-sage)' : 'var(--botanical-terracotta)'}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;`;
const GuideList = styled.ul`list-style: none;`;
const GuideItem = styled.li`font-family: var(--font-body); font-size: 0.9rem; color: var(--botanical-brown); padding: 0.4rem 0; display: flex; align-items: center; gap: 0.5rem;`;

function Dresscode() {
  const { content } = useWedding();
  const data = content?.dresscode || {};
  const title = data.title || 'Dresscode';
  const code = data.code || 'Garden Party Chic';
  const colors = data.colors || [{ name: 'Salbei', hex: '#9CAF88' }, { name: 'Creme', hex: '#FAF8F5' }, { name: 'Terracotta', hex: '#C17F59' }, { name: 'Olive', hex: '#6B7F5E' }];
  const dos = data.dos || ['Sommerliche Eleganz', 'Bequeme Schuhe', 'Natuerliche Toene'];
  const donts = data.donts || ['Weiss/Creme (Braut)', 'Sehr dunkle Farben', 'Stilettos (Rasen!)'];
  
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
        <Eyebrow $visible={visible}>👗 Was ihr anziehen koennt</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <CodeBadge $visible={visible}><CodeIcon>🌸</CodeIcon><CodeText>{code}</CodeText><CodeIcon>🌿</CodeIcon></CodeBadge>
        <Palette $visible={visible}>{colors.map((c, i) => <Swatch key={i}><Color $hex={c.hex} /><ColorName>{c.name}</ColorName></Swatch>)}</Palette>
        <Guidelines $visible={visible}>
          <GuideCard><GuideTitle $type="do">✅ Empfohlen</GuideTitle><GuideList>{dos.map((item, i) => <GuideItem key={i}>🌿 {item}</GuideItem>)}</GuideList></GuideCard>
          <GuideCard><GuideTitle $type="dont">❌ Bitte vermeiden</GuideTitle><GuideList>{donts.map((item, i) => <GuideItem key={i}>🍂 {item}</GuideItem>)}</GuideList></GuideCard>
        </Guidelines>
      </Container>
    </Section>
  );
}

export default Dresscode;
