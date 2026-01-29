// Luxe LoveStory - Cinematic with Parallax Images
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-100px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideFromRight = keyframes`
  from { opacity: 0; transform: translateX(100px); }
  to { opacity: 1; transform: translateX(0); }
`;

const scaleReveal = keyframes`
  from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
`;

const Section = styled.section`
  padding: var(--section-padding-y) 0;
  background: var(--luxe-anthracite);
`;

const Header = styled.div`
  text-align: center;
  padding: 0 var(--section-padding-x);
  margin-bottom: 5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.1s;
`;

const StoryItem = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$reverse ? '1fr 1.2fr' : '1.2fr 1fr'};
  min-height: 80vh;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  order: ${p => p.$reverse ? 2 : 1};
  
  @media (max-width: 900px) {
    order: 1;
    aspect-ratio: 4/3;
  }
`;

const Image = styled.div`
  position: absolute;
  inset: 0;
  background: ${p => p.$image ? `url(${p.$image})` : 'linear-gradient(135deg, var(--luxe-charcoal) 0%, var(--luxe-graphite) 100%)'};
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.1);
  animation: ${p => p.$visible ? css`${scaleReveal} 1.2s var(--ease-out-expo) forwards` : 'none'};
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 4rem var(--section-padding-x);
  background: ${p => p.$dark ? 'var(--luxe-void)' : 'var(--luxe-charcoal)'};
  order: ${p => p.$reverse ? 1 : 2};
  
  @media (max-width: 900px) {
    order: 2;
    padding: 3rem var(--section-padding-x);
  }
`;

const Content = styled.div`
  max-width: 450px;
  opacity: 0;
  animation: ${p => p.$visible ? (p.$reverse ? css`${slideFromLeft}` : css`${slideFromRight}`) : 'none'} 1s var(--ease-out-expo) forwards;
  animation-delay: 0.3s;
`;

const Year = styled.span`
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  display: block;
  margin-bottom: 1.5rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-cream);
  margin-bottom: 1.5rem;
`;

const ItemText = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.9;
  color: var(--luxe-pearl);
`;

function LoveStory() {
  const { content } = useWedding();
  const storyData = content?.lovestory || {};
  const title = storyData.title || 'Unsere Geschichte';
  const items = storyData.items || [];
  
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const headerRef = useRef(null);
  const itemRefs = useRef([]);

  const defaultItems = [
    { year: '2019', title: 'Der erste Blick', text: 'Bei einem gemeinsamen Abendessen mit Freunden trafen sich unsere Blicke zum ersten Mal. Ein Moment, der alles veraenderte.', image: '' },
    { year: '2020', title: 'Das erste Date', text: 'Ein Spaziergang am See, gefolgt von Kaffee in einem kleinen Cafe. Die Stunden vergingen wie Minuten.', image: '' },
    { year: '2024', title: 'Die Frage', text: 'Bei Sonnenuntergang, an unserem Lieblingsort, stellte er die Frage aller Fragen. Unter Traenen sagte sie ja.', image: '' }
  ];

  const storyItems = items.length > 0 ? items : defaultItems;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); }, { threshold: 0.3 });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setVisibleItems(prev => [...new Set([...prev, i])]);
      }, { threshold: 0.3 });
      if (ref) observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [storyItems.length]);

  return (
    <Section id="story">
      <Header ref={headerRef}>
        <Eyebrow $visible={headerVisible}>Unsere Reise</Eyebrow>
        <Title $visible={headerVisible}>{title}</Title>
      </Header>
      
      {storyItems.map((item, i) => {
        const isReverse = i % 2 !== 0;
        const isVisible = visibleItems.includes(i);
        return (
          <StoryItem key={i} ref={el => itemRefs.current[i] = el} $reverse={isReverse}>
            <ImageWrapper $reverse={isReverse}>
              <Image $image={item.image} $visible={isVisible} />
            </ImageWrapper>
            <ContentWrapper $reverse={isReverse} $dark={i % 2 === 0}>
              <Content $visible={isVisible} $reverse={isReverse}>
                <Year>{item.year}</Year>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.text}</ItemText>
              </Content>
            </ContentWrapper>
          </StoryItem>
        );
      })}
    </Section>
  );
}

export default LoveStory;
