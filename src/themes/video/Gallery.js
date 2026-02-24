import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 900px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; @media (max-width: 600px) { grid-template-columns: repeat(2, 1fr); }`;
const ImageWrapper = styled.div`aspect-ratio: 1/1; overflow: hidden; cursor: pointer; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.15 + p.$index * 0.05}s;`;
const Image = styled.div`width: 100%; height: 100%; background: ${p => p.$image ? `url(${p.$image}) center/cover` : 'linear-gradient(135deg, var(--video-dark), var(--video-charcoal))'};filter: grayscale(100%); transition: filter 0.6s var(--ease-smooth), transform 0.6s var(--ease-smooth); &:hover { filter: grayscale(0%); transform: scale(1.05); }`;
const Placeholder = styled.div`width: 100%; height: 100%; background: var(--video-dark); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--video-gray);`;
const Lightbox = styled.div`position: fixed; inset: 0; background: rgba(10, 10, 10, 0.98); z-index: 2000; display: flex; align-items: center; justify-content: center; opacity: ${p => p.$open ? 1 : 0}; visibility: ${p => p.$open ? 'visible' : 'hidden'}; transition: all 0.4s ease;`;
const LightboxImage = styled.img`max-width: 90%; max-height: 85vh; object-fit: contain;`;
const LightboxClose = styled.button`position: absolute; top: 2rem; right: 2rem; font-size: 2rem; color: var(--video-white); &:hover { color: var(--video-accent); }`;
const LightboxNav = styled.button`position: absolute; top: 50%; transform: translateY(-50%); font-size: 2.5rem; color: var(--video-white); padding: 1rem; &:hover { color: var(--video-accent); } &.prev { left: 1rem; } &.next { right: 1rem; }`;

function Gallery() {
  const { content } = useWedding();
  const data = content?.gallery || {};
  const title = data.title || 'Galerie';
  const rawImages = Array.isArray(data.images) && data.images.length > 0 ? data.images : [];
  const images = rawImages.map(img => typeof img === 'string' ? { url: img, caption: '' } : { url: img.url || '', caption: img.caption || '' });
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const openLightbox = (i) => { if (images[i]?.url) { setLightbox({ open: true, index: i }); } };
  const closeLightbox = () => setLightbox({ ...lightbox, open: false });
  const navigate = (dir) => setLightbox(prev => ({ ...prev, index: (prev.index + dir + images.length) % images.length }));

  return (
    <SectionWrapper id="gallery">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Momente</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Grid>
          {images.map((img, i) => (
            <ImageWrapper key={i} $visible={visible} $index={i} onClick={() => openLightbox(i)}>
              {img.url ? <Image $image={optimizedUrl.thumb(img.url)} /> : <Placeholder>+</Placeholder>}
            </ImageWrapper>
          ))}
        </Grid>
      </Content>
      <Lightbox $open={lightbox.open} onClick={closeLightbox}>
        {images[lightbox.index]?.url && <LightboxImage src={optimizedUrl.card(images[lightbox.index].url)} alt="" onClick={e => e.stopPropagation()} />}
        <LightboxClose onClick={closeLightbox}>x</LightboxClose>
        <LightboxNav className="prev" onClick={e => { e.stopPropagation(); navigate(-1); }}>&#8249;</LightboxNav>
        <LightboxNav className="next" onClick={e => { e.stopPropagation(); navigate(1); }}>&#8250;</LightboxNav>
      </Lightbox>
    </SectionWrapper>
  );
}

export default Gallery;
