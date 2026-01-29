// Botanical LoveStory - Garden Path Style
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const drawLine = keyframes`from { height: 0; } to { height: 100%; }`;
const grow = keyframes`from { transform: scale(0); } to { transform: scale(1); }`;
const sway = keyframes`0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); }`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(180deg, var(--botanical-cream) 0%, var(--botanical-mint) 100%);
  position: relative;
`;

const Container = styled.div`max-width: 900px; margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 4rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Timeline = styled.div`position: relative; padding-left: 60px; @media (max-width: 600px) { padding-left: 40px; }`;

const TimelineLine = styled.div`
  position: absolute;
  left: 20px;
  top: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--botanical-sage), var(--botanical-olive), var(--botanical-forest));
  border-radius: 4px;
  height: ${p => p.$visible ? '100%' : '0'};
  transition: height 2s ease;
  
  @media (max-width: 600px) { left: 10px; width: 3px; }
`;

const StoryItem = styled.div`
  position: relative;
  padding-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: ${p => 0.3 + p.$index * 0.2}s;
  
  &:last-child { padding-bottom: 0; }
`;

const Marker = styled.div`
  position: absolute;
  left: -52px;
  top: 0;
  width: 40px;
  height: 40px;
  background: var(--botanical-cream);
  border: 3px solid var(--botanical-sage);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transform: scale(0);
  animation: ${p => p.$visible ? css`${grow} 0.5s var(--ease-organic) forwards` : 'none'};
  animation-delay: ${p => 0.2 + p.$index * 0.2}s;
  
  @media (max-width: 600px) { left: -35px; width: 30px; height: 30px; font-size: 1rem; }
`;

const Card = styled.div`
  background: var(--botanical-cream);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(107, 127, 94, 0.15);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -15px;
    top: 15px;
    border: 10px solid transparent;
    border-right-color: var(--botanical-cream);
  }
`;

const Year = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: var(--botanical-sage);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 0.75rem;
`;

const ItemTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 1.75rem;
  color: var(--botanical-forest);
  margin-bottom: 0.75rem;
`;

const ItemText = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--botanical-brown);
`;

const ImageWrapper = styled.div`
  margin-top: 1rem;
  border-radius: 15px;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'var(--botanical-mint)'};
`;

function LoveStory() {
  const { content } = useWedding();
  const data = content?.lovestory || {};
  const title = data.title || 'Unsere Geschichte';
  const items = data.items || [
    { year: '2019', title: 'Der Anfang', text: 'Bei einem Picknick im Park trafen sich unsere Blicke zum ersten Mal...', icon: '🌱', image: '' },
    { year: '2020', title: 'Das erste Date', text: 'Ein Spaziergang durch den botanischen Garten wurde zum Beginn von allem.', icon: '🌸', image: '' },
    { year: '2023', title: 'Die Frage', text: 'Unter unserem Lieblingsbaum kniete er nieder und fragte...', icon: '💍', image: '' },
    { year: '2025', title: 'Für immer', text: 'Wir sagen Ja! Und feiern unsere Liebe mit euch.', icon: '💒', image: '' }
  ];
  
  const [headerVisible, setHeaderVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState([]);
  const headerRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); }, { threshold: 0.3 });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observers = itemRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setItemsVisible(prev => [...new Set([...prev, i])]);
      }, { threshold: 0.3 });
      if (ref) observer.observe(ref);
      return observer;
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, [items.length]);

  return (
    <Section id="story">
      <Container>
        <Header ref={headerRef}>
          <Eyebrow $visible={headerVisible}>Unsere Reise 🌿</Eyebrow>
          <Title $visible={headerVisible}>{title}</Title>
        </Header>
        
        <Timeline>
          <TimelineLine $visible={headerVisible} />
          {items.map((item, i) => {
            const isVisible = itemsVisible.includes(i);
            return (
              <StoryItem key={i} ref={el => itemRefs.current[i] = el} $visible={isVisible} $index={i}>
                <Marker $visible={isVisible} $index={i}>{item.icon}</Marker>
                <Card>
                  <Year>{item.year}</Year>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemText>{item.text}</ItemText>
                  {item.image && <ImageWrapper $image={item.image} />}
                </Card>
              </StoryItem>
            );
          })}
        </Timeline>
      </Container>
    </Section>
  );
}

export default LoveStory;
