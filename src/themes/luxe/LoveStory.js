// Luxe LoveStory - Elegant, Bildbasiert
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-80px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(80px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--luxe-cream);
`;

const Container = styled.div`
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  opacity: 0;
  animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-taupe);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  font-style: italic;
  color: var(--luxe-black);
`;

const StoryItem = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$reverse ? '1fr 1.2fr' : '1.2fr 1fr'};
  gap: 4rem;
  align-items: center;
  margin-bottom: 6rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  opacity: 0;
  animation: ${p => p.$visible ? (p.$fromRight ? slideInRight : slideInLeft) : 'none'} 1s var(--transition-slow) forwards;
  animation-delay: ${p => p.$delay || '0s'};
  order: ${p => p.$reverse ? 2 : 1};
  
  @media (max-width: 768px) {
    order: 1;
  }
`;

const Image = styled.div`
  aspect-ratio: 4/5;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--luxe-sand)'};
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--luxe-taupe);
    transform: translate(15px, 15px);
    z-index: -1;
  }
`;

const ContentWrapper = styled.div`
  opacity: 0;
  animation: ${p => p.$visible ? (p.$fromRight ? slideInLeft : slideInRight) : 'none'} 1s var(--transition-slow) forwards;
  animation-delay: ${p => p.$delay || '0.2s'};
  order: ${p => p.$reverse ? 1 : 2};
  
  @media (max-width: 768px) {
    order: 2;
  }
`;

const Year = styled.span`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  display: block;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  color: var(--luxe-black);
  margin-bottom: 1.5rem;
`;

const ItemText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.9;
  color: var(--luxe-charcoal);
`;

function LoveStory() {
  const { content } = useWedding();
  const storyData = content?.lovestory || {};
  
  const title = storyData.title || 'Unsere Geschichte';
  const items = storyData.items || [];
  
  const [visible, setVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);

  const defaultItems = [
    {
      year: '2019',
      title: 'Wie alles begann',
      text: 'Bei einem gemeinsamen Abendessen mit Freunden trafen sich unsere Blicke zum ersten Mal. Was als ein einfaches Gespraech begann, wurde schnell zu stundenlangem Lachen und Geschichten erzaehlen.',
      image: ''
    },
    {
      year: '2020',
      title: 'Das erste Date',
      text: 'Ein Spaziergang durch den Park, gefolgt von Kaffee in einem kleinen Cafe. Die Nervositaet verwandelte sich schnell in pure Freude, als wir merkten, wie viel wir gemeinsam hatten.',
      image: ''
    },
    {
      year: '2024',
      title: 'Die Frage',
      text: 'Bei Sonnenuntergang, an unserem Lieblingsort, kniete er nieder und stellte die Frage, die unser Leben fuer immer veraendern sollte. Unter Traenen sagte sie ja.',
      image: ''
    }
  ];

  const storyItems = items.length > 0 ? items : defaultItems;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => [...new Set([...prev, i])]);
          }
        },
        { threshold: 0.3 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [storyItems.length]);

  return (
    <Section ref={sectionRef} id="story">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Unsere Reise</Eyebrow>
          <Title>{title}</Title>
        </Header>
        
        {storyItems.map((item, i) => {
          const isReverse = i % 2 !== 0;
          const isVisible = visibleItems.includes(i);
          
          return (
            <StoryItem 
              key={i} 
              ref={el => itemRefs.current[i] = el}
              $reverse={isReverse}
            >
              <ImageWrapper $visible={isVisible} $fromRight={isReverse} $reverse={isReverse}>
                <Image $image={item.image} />
              </ImageWrapper>
              <ContentWrapper $visible={isVisible} $fromRight={!isReverse} $reverse={isReverse}>
                <Year>{item.year}</Year>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemText>{item.text}</ItemText>
              </ContentWrapper>
            </StoryItem>
          );
        })}
      </Container>
    </Section>
  );
}

export default LoveStory;
