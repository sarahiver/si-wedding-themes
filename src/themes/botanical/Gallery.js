// Botanical Gallery - Polaroid Garden Style
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const float = keyframes`0%, 100% { transform: translateY(0) rotate(var(--rotation)); } 50% { transform: translateY(-5px) rotate(calc(var(--rotation) + 2deg)); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-paper);`;
const Container = styled.div`max-width: 1100px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  @media (max-width: 800px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const Polaroid = styled.div`
  --rotation: ${p => p.$rotation}deg;
  background: white;
  padding: 1rem 1rem 3rem;
  border-radius: 4px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards, ${float} 4s ease-in-out infinite` : 'none'};
  animation-delay: ${p => 0.1 + p.$index * 0.08}s, ${p => 0.1 + p.$index * 0.08}s;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: rotate(var(--rotation));
  
  &:hover {
    transform: rotate(0deg) scale(1.05);
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    z-index: 10;
  }
`;

const PolaroidImage = styled.div`
  aspect-ratio: 1/1;
  background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'linear-gradient(135deg, var(--botanical-mint), var(--botanical-sage))'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const PolaroidCaption = styled.p`
  font-family: var(--font-handwritten);
  font-size: 1rem;
  color: var(--botanical-forest);
  text-align: center;
  margin-top: 0.75rem;
`;

// Lightbox
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(45, 90, 74, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.4s ease;
`;
const LightboxImage = styled.img`max-width: 90%; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);`;
const LightboxClose = styled.button`position: absolute; top: 2rem; right: 2rem; font-size: 2rem; color: white; &:hover { color: var(--botanical-lime); }`;
const LightboxNav = styled.button`position: absolute; top: 50%; transform: translateY(-50%); font-size: 2.5rem; color: white; padding: 1rem; &:hover { color: var(--botanical-lime); } &.prev { left: 1rem; } &.next { right: 1rem; }`;

function Gallery() {
  const { content } = useWedding();
  const data = content?.gallery || {};
  const title = data.title || 'Unsere Momente';
  const images = data.images || Array(9).fill({ url: '', caption: '' });
  
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const rotations = [-3, 2, -1, 3, -2, 1, -3, 2, -1];
  const emojis = ['🌿', '🌸', '🍃', '🌷', '🌻', '🌺', '🌲', '🌼', '🌱'];

  const openLightbox = (i) => { if (images[i]?.url) { setLightbox({ open: true, index: i }); document.body.style.overflow = 'hidden'; } };
  const closeLightbox = () => { setLightbox({ ...lightbox, open: false }); document.body.style.overflow = ''; };
  const navigate = (dir) => setLightbox(prev => ({ ...prev, index: (prev.index + dir + images.length) % images.length }));

  useEffect(() => {
    const handleKey = (e) => { if (!lightbox.open) return; if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') navigate(-1); if (e.key === 'ArrowRight') navigate(1); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox.open]);

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📸 Galerie</Eyebrow>
          <Title $visible={visible}>{title}</Title>
        </Header>
        <Grid>
          {images.map((img, i) => (
            <Polaroid key={i} $visible={visible} $index={i} $rotation={rotations[i % rotations.length]} onClick={() => openLightbox(i)}>
              <PolaroidImage $image={img.url}>{!img.url && emojis[i % emojis.length]}</PolaroidImage>
              <PolaroidCaption>{img.caption || `Moment ${i + 1}`}</PolaroidCaption>
            </Polaroid>
          ))}
        </Grid>
      </Container>
      
      <Lightbox $open={lightbox.open} onClick={closeLightbox}>
        {images[lightbox.index]?.url && <LightboxImage src={images[lightbox.index].url} alt="" onClick={e => e.stopPropagation()} />}
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        <LightboxNav className="prev" onClick={e => { e.stopPropagation(); navigate(-1); }}>‹</LightboxNav>
        <LightboxNav className="next" onClick={e => { e.stopPropagation(); navigate(1); }}>›</LightboxNav>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
