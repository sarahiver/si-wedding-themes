import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const marquee = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const marqueeReverse = keyframes`
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
`;

const Section = styled.section`
  padding: 8rem 0;
  background: var(--black);
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding: 0 2rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const MarqueeRow = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  
  &:hover .track {
    animation-play-state: paused;
  }
`;

const MarqueeTrackForward = styled.div`
  display: flex;
  gap: 1.5rem;
  animation: ${marquee} 35s linear infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const MarqueeTrackReverse = styled.div`
  display: flex;
  gap: 1.5rem;
  animation: ${marqueeReverse} 40s linear infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const gradients = [
  'linear-gradient(135deg, var(--coral), var(--pink))',
  'linear-gradient(135deg, var(--electric), var(--purple))',
  'linear-gradient(135deg, var(--yellow), var(--coral))',
  'linear-gradient(135deg, var(--purple), var(--pink))',
  'linear-gradient(135deg, var(--coral), var(--yellow))',
  'linear-gradient(135deg, var(--electric), var(--yellow))',
];

const ImageCard = styled.div`
  flex-shrink: 0;
  width: ${p => p.$size === 'large' ? '400px' : p.$size === 'medium' ? '300px' : '220px'};
  height: ${p => p.$size === 'large' ? '300px' : p.$size === 'medium' ? '220px' : '180px'};
  background: ${p => p.$gradient};
  border: 3px solid var(--black);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: var(--shadow-lg);
    
    .overlay {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: ${p => p.$size === 'large' ? '280px' : p.$size === 'medium' ? '220px' : '180px'};
    height: ${p => p.$size === 'large' ? '220px' : p.$size === 'medium' ? '180px' : '140px'};
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ImageTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--white);
`;

const ViewAllButton = styled.a`
  display: block;
  width: fit-content;
  margin: 3rem auto 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--black);
  background: var(--yellow);
  padding: 1rem 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--coral);
    color: var(--white);
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
`;

function Gallery({ content = {} }) {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const title = content.title || 'Memories';
  const images = content.images || [];

  const sizes = ['small', 'medium', 'large', 'small', 'medium', 'small', 'large', 'medium'];
  
  const defaultImages = Array.from({ length: 16 }, (_, i) => ({
    title: `Foto ${i + 1}`,
    gradient: gradients[i % gradients.length],
    size: sizes[i % sizes.length]
  }));

  const items = images.length > 0 ? images : defaultImages;
  const row1 = items.slice(0, 8);
  const row2 = items.slice(8, 16);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const renderCards = (rowImages) => (
    [...rowImages, ...rowImages].map((img, i) => (
      <ImageCard key={i} $gradient={img.gradient} $size={img.size}>
        <ImageOverlay className="overlay">
          <ImageTitle>{img.title}</ImageTitle>
        </ImageOverlay>
      </ImageCard>
    ))
  );

  return (
    <Section ref={sectionRef} id="gallery">
      <Header>
        <Eyebrow $visible={visible}>📸 Galerie</Eyebrow>
        <Title $visible={visible}>{title}</Title>
      </Header>
      
      <MarqueeRow>
        <MarqueeTrackForward className="track">
          {renderCards(row1)}
        </MarqueeTrackForward>
      </MarqueeRow>
      
      <MarqueeRow>
        <MarqueeTrackReverse className="track">
          {renderCards(row2)}
        </MarqueeTrackReverse>
      </MarqueeRow>
      
      <ViewAllButton href="#">Alle Fotos ansehen →</ViewAllButton>
    </Section>
  );
}

export default Gallery;
