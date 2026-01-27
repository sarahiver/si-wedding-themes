import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// LUXE LOVE STORY - Horizontal Carousel with Stacked Cards
// Cards stack behind each other and slide forward on click
// ═══════════════════════════════════════════════════════════════════════════

const Section = styled.section`
  padding: 8rem 0;
  background: var(--luxe-cream);
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 0 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--luxe-text-muted);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-style: italic;
  color: var(--luxe-text-heading);
`;

const CarouselWrapper = styled.div`
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const CarouselTrack = styled.div`
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    height: 450px;
  }
`;

const Card = styled.div`
  position: absolute;
  width: 100%;
  max-width: 900px;
  height: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  background: var(--luxe-white);
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  
  /* Stacking effect based on position */
  ${p => {
    const offset = p.$offset;
    const isActive = offset === 0;
    const isPrev = offset < 0;
    const isNext = offset > 0;
    
    if (isActive) {
      return css`
        z-index: 10;
        transform: translateX(0) scale(1);
        opacity: 1;
      `;
    } else if (isNext) {
      return css`
        z-index: ${5 - Math.abs(offset)};
        transform: translateX(${offset * 80}px) scale(${1 - Math.abs(offset) * 0.05});
        opacity: ${1 - Math.abs(offset) * 0.3};
        filter: brightness(${1 - Math.abs(offset) * 0.1});
      `;
    } else {
      return css`
        z-index: ${5 - Math.abs(offset)};
        transform: translateX(${offset * 80}px) scale(${1 - Math.abs(offset) * 0.05});
        opacity: ${offset === -1 ? 0.3 : 0};
        pointer-events: none;
      `;
    }
  }}
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;

const CardImage = styled.div`
  background-image: url(${p => p.$image});
  background-size: cover;
  background-position: center;
  filter: grayscale(30%);
  transition: filter 0.4s ease;
  
  ${Card}:hover & {
    filter: grayscale(0%);
  }
`;

const CardContent = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const CardDate = styled.p`
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--luxe-gold);
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-style: italic;
  color: var(--luxe-text-heading);
  margin-bottom: 1.5rem;
`;

const CardText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--luxe-text-light);
  line-height: 1.9;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const NavButton = styled.button`
  width: 50px;
  height: 50px;
  border: 1px solid var(--luxe-border);
  background: var(--luxe-white);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: var(--luxe-gold);
    color: var(--luxe-gold);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Dot = styled.button`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$active ? 'var(--luxe-gold)' : 'var(--luxe-border)'};
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--luxe-gold);
  }
`;

const Counter = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--luxe-text-muted);
`;

function LoveStory({ stories }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const defaultStories = [
    {
      date: 'März 2018',
      title: 'Das erste Treffen',
      text: 'Wir trafen uns zufällig bei einem gemeinsamen Freund. Ein kurzes Gespräch, ein Lächeln – und wir wussten beide, dass dies der Anfang von etwas Besonderem war. Die Stunden vergingen wie Minuten.',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    },
    {
      date: 'Juni 2019',
      title: 'Der erste Urlaub',
      text: 'Eine Woche Toskana, nur wir zwei. Zwischen Weinbergen und Sonnenuntergängen entstand eine tiefe Verbindung. Hier wussten wir: Das ist mehr als nur Verliebtheit.',
      image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800',
    },
    {
      date: 'November 2021',
      title: 'Zusammenziehen',
      text: 'Unsere erste gemeinsame Wohnung. Chaos beim Umzug, aber jeder Karton ein Schritt in unser gemeinsames Leben. Endlich jeden Morgen nebeneinander aufwachen.',
      image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800',
    },
    {
      date: 'Dezember 2025',
      title: 'Der Antrag',
      text: 'Bei einem romantischen Winterspaziergang stellte Kalle die Frage aller Fragen. Mit Tränen in den Augen und einem strahlenden Lächeln sagte Dave ja.',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
    },
  ];
  
  const storyData = stories || defaultStories;
  
  const goNext = () => {
    if (activeIndex < storyData.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };
  
  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };
  
  return (
    <Section id="story">
      <Header>
        <Eyebrow>Unsere Geschichte</Eyebrow>
        <Title>Wie alles begann</Title>
      </Header>
      
      <CarouselWrapper>
        <CarouselTrack>
          {storyData.map((story, index) => (
            <Card 
              key={index} 
              $offset={index - activeIndex}
              onClick={() => index > activeIndex && goNext()}
            >
              <CardImage $image={story.image} />
              <CardContent>
                <CardDate>{story.date}</CardDate>
                <CardTitle>{story.title}</CardTitle>
                <CardText>{story.text}</CardText>
              </CardContent>
            </Card>
          ))}
        </CarouselTrack>
        
        <Navigation>
          <NavButton onClick={goPrev} disabled={activeIndex === 0}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </NavButton>
          
          <Dots>
            {storyData.map((_, index) => (
              <Dot 
                key={index} 
                $active={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </Dots>
          
          <NavButton onClick={goNext} disabled={activeIndex === storyData.length - 1}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </NavButton>
        </Navigation>
        
        <Counter style={{ textAlign: 'center', marginTop: '1rem' }}>
          {activeIndex + 1} / {storyData.length}
        </Counter>
      </CarouselWrapper>
    </Section>
  );
}

export default LoveStory;
