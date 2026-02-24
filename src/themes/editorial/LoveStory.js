import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const letterReveal = keyframes`
  0% { opacity: 0; transform: translateY(100%); }
  100% { opacity: 1; transform: translateY(0); }
`;

const imageReveal = keyframes`
  from { 
    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  }
  to { 
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: clamp(2rem, 4vh, 4rem) 0 var(--section-padding);
  background: var(--editorial-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  margin-bottom: clamp(4rem, 10vw, 8rem);
  max-width: 900px;
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  overflow: hidden;
  
  .word {
    display: inline-block;
    overflow: hidden;
  }
  
  .letter {
    display: inline-block;
    opacity: 0;
    transform: translateY(100%);
    
    ${p => p.$visible && css`
      animation: ${letterReveal} 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
    `}
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 2rem;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.6s;
  `}
`;

// Newspaper-style article layout
const ArticlesGrid = styled.div`
  display: grid;
  gap: clamp(4rem, 8vw, 8rem);
  
  @media (max-width: 900px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    /* Kein padding-right damit letzte Card angeschnitten ist */
    padding-right: 0;
    
    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const MobileScrollHint = styled.div`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    font-family: var(--font-body);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--editorial-gray);
    opacity: 0;
    
    ${p => p.$visible && css`
      animation: ${fadeInUp} 0.8s ease forwards;
      animation-delay: 0.5s;
    `}
  }
`;

const ScrollArrow = styled.span`
  display: inline-block;
  animation: scrollBounce 1.5s ease-in-out infinite;
  
  @keyframes scrollBounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  }
`;

const Article = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  
  /* Alternate layout for even items */
  &:nth-child(even) {
    direction: rtl;
    > * { direction: ltr; }
  }
  
  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 75vw;
    max-width: 320px;
    scroll-snap-align: start;
    gap: 1rem;
    
    &:nth-child(even) {
      direction: ltr;
    }
    
    /* Letztes Element braucht Abstand rechts */
    &:last-child {
      margin-right: 1.5rem;
    }
  }
`;

const ArticleImage = styled.div`
  position: relative;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 1s ease forwards;
    animation-delay: ${p.$delay}s;
  `}
  
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const ImageFrame = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--editorial-light-gray);
  
  &::before {
    content: '';
    display: block;
    padding-top: 130%; /* Tall magazine-style ratio */
  }
  
  @media (max-width: 900px) {
    &::before {
      padding-top: 100%; /* Quadratisch auf Mobile */
    }
  }
  
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(30%);
    transition: all 0.6s ease;
  }
  
  &:hover img {
    filter: grayscale(0%);
    transform: scale(1.03);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  
  ${p => p.$visible && css`
    animation: ${imageReveal} 1s cubic-bezier(0.77, 0, 0.175, 1) forwards;
    animation-delay: ${p.$delay + 0.2}s;
  `}
`;

const DateBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: var(--editorial-red);
  color: var(--editorial-white);
  padding: 0.75rem 1.25rem;
  font-family: var(--font-headline);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  z-index: 2;
`;

const ArticleContent = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: ${p.$delay + 0.3}s;
  `}
`;

const ArticleNumber = styled.span`
  display: block;
  font-family: var(--font-headline);
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 700;
  color: var(--editorial-light-gray);
  line-height: 0.8;
  margin-bottom: 1rem;
`;

const ArticleHeadline = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.95;
  margin-bottom: 1.5rem;
`;

const ArticleLine = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin-bottom: 1.5rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: ${p.$delay + 0.5}s;
  `}
`;

const ArticleText = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  color: var(--editorial-gray);
  line-height: 1.8;
  margin-bottom: 0;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--editorial-light-gray);
`;

const MetaItem = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-gray);
`;

// ============================================
// HELPER
// ============================================

const AnimatedTitle = ({ text, visible }) => {
  const words = text.split(' ');
  let letterIndex = 0;
  
  return (
    <Title $visible={visible}>
      {words.map((word, wi) => (
        <span key={wi} className="word">
          {word.split('').map((letter, li) => {
            const delay = letterIndex * 0.03 + 0.2;
            letterIndex++;
            return (
              <span 
                key={li} 
                className="letter" 
                style={{ animationDelay: `${delay}s` }}
              >
                {letter}
              </span>
            );
          })}
          {wi < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </Title>
  );
};

// ============================================
// COMPONENT
// ============================================

function LoveStory() {
  const { content } = useWedding();
  const lovestoryData = content?.lovestory || {};
  
  const title = lovestoryData.title || 'Unsere Geschichte';
  const subtitle = lovestoryData.subtitle || 'Eine Liebe, die Geschichten schreibt';
  const events = lovestoryData.events || [];
  
  const [headerVisible, setHeaderVisible] = useState(false);
  const [visibleArticles, setVisibleArticles] = useState([]);
  const sectionRef = useRef(null);
  const articleRefs = useRef([]);

  const defaultEvents = [
    { 
      date: '2018', 
      title: 'Das erste Treffen', 
      description: 'Es war ein ganz normaler Abend bei gemeinsamen Freunden. Doch dieser Abend sollte alles verändern. Ein Blick, ein Lächeln, ein Gespräch das nicht mehr enden wollte.', 
      image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800' 
    },
    { 
      date: '2019', 
      title: 'Der erste Urlaub', 
      description: 'Zwei Wochen Italien – von Rom bis zur Amalfiküste. Wir haben gelernt, dass wir auch auf engstem Raum perfekt harmonieren. Und dass keiner von uns Karten lesen kann.', 
      image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800' 
    },
    { 
      date: '2021', 
      title: 'Zusammenziehen', 
      description: 'Die erste gemeinsame Wohnung. Zu klein, zu teuer, absolut perfekt. Hier haben wir gelernt, was es heißt, ein Team zu sein – beim IKEA-Aufbau und im echten Leben.', 
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800' 
    },
    { 
      date: '2024', 
      title: 'Der Antrag', 
      description: 'Unter dem Sternenhimmel, mit zitternden Händen und dem wichtigsten Satz unseres Lebens. Die Antwort kam schneller als die Frage zu Ende war.', 
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800' 
    },
  ];

  const items = events.length > 0 ? events : defaultEvents;

  // Header intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Articles intersection observer
  useEffect(() => {
    const observers = articleRefs.current.map((ref, i) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleArticles(prev => [...new Set([...prev, i])]);
          }
        },
        { threshold: 0.2 }
      );
      if (ref) observer.observe(ref);
      return observer;
    });
    
    return () => observers.forEach(obs => obs.disconnect());
  }, [items.length]);

  return (
    <Section id="lovestory" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={headerVisible}>Kapitel für Kapitel</Eyebrow>
          <AnimatedTitle text={title} visible={headerVisible} />
          <Subtitle $visible={headerVisible}>{subtitle}</Subtitle>
        </Header>
        
        <MobileScrollHint $visible={headerVisible}>
          <span>Wischen zum Entdecken</span>
          <ScrollArrow>→</ScrollArrow>
        </MobileScrollHint>
        
        <ArticlesGrid>
          {items.map((item, i) => {
            const isVisible = visibleArticles.includes(i);
            const delay = 0;
            
            return (
              <Article key={i} ref={el => articleRefs.current[i] = el}>
                <ArticleImage $visible={isVisible} $delay={delay}>
                  <ImageFrame>
                    <ImageOverlay $visible={isVisible} $delay={delay}>
                      {item.image && <img src={optimizedUrl.card(item.image)} alt={item.title} />}
                    </ImageOverlay>
                  </ImageFrame>
                  <DateBadge>{item.date}</DateBadge>
                </ArticleImage>
                
                <ArticleContent $visible={isVisible} $delay={delay}>
                  <ArticleNumber>{String(i + 1).padStart(2, '0')}</ArticleNumber>
                  <ArticleHeadline>{item.title}</ArticleHeadline>
                  <ArticleLine $visible={isVisible} $delay={delay} />
                  <ArticleText>{item.description}</ArticleText>
                  
                  {item.location && (
                    <ArticleMeta>
                      <MetaItem>📍 {item.location}</MetaItem>
                    </ArticleMeta>
                  )}
                </ArticleContent>
              </Article>
            );
          })}
        </ArticlesGrid>
      </Container>
    </Section>
  );
}

export default LoveStory;
