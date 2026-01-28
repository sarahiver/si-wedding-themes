import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { getPhotoUploads } from '../../lib/supabase';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream-dark);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.8s ease;
`;

const Eyebrow = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--sage-dark);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const Subtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 1rem;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.6rem 1.25rem;
  background: ${p => p.$active ? 'var(--sage)' : 'transparent'};
  color: ${p => p.$active ? 'white' : 'var(--text-light)'};
  border: 1px solid ${p => p.$active ? 'var(--sage)' : 'var(--sage-light)'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--sage);
    color: ${p => p.$active ? 'white' : 'var(--forest)'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ImageCard = styled.div`
  aspect-ratio: ${p => p.$ratio || '4/5'};
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '20px'});
  transition: all 0.6s ease;
  transition-delay: ${p => p.$index * 0.08}s;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
  
  &:hover img { transform: scale(1.08); }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(45,59,45,0.4) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after { opacity: 1; }
`;

const ImageCaption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1;
  
  ${ImageCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--cream), var(--sage-muted));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: 0.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
  
  .icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.3; }
  p { font-family: 'Lato', sans-serif; }
`;

/* Lightbox */
const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(45, 59, 45, 0.97);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: ${p => p.$open ? 1 : 0};
  visibility: ${p => p.$open ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  animation: ${fadeIn} 0.3s ease;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover { opacity: 1; }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${p => p.$direction === 'prev' ? 'left: 2rem;' : 'right: 2rem;'}
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover { background: rgba(255,255,255,0.2); }
`;

const LightboxCounter = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  opacity: 0.7;
`;

function Gallery() {
  const { content } = useWedding();
  const galleryData = content?.gallery || {};
  const { projectId } = useWedding();
  const [visible, setVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [guestPhotos, setGuestPhotos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const title = galleryData.title || 'Galerie';
  const subtitle = galleryData.subtitle || '';
  const staticImages = galleryData.images || [];

  // Load guest-uploaded photos
  const loadGuestPhotos = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await getPhotoUploads(projectId, true);
      setGuestPhotos(data || []);
    } catch (err) {
      console.error('Error loading guest photos:', err);
    }
  }, [projectId]);

  useEffect(() => {
    loadGuestPhotos();
  }, [loadGuestPhotos]);

  // Combine static and guest photos
  useEffect(() => {
    const combined = [
      ...staticImages.map(img => ({
        url: typeof img === 'string' ? img : img.url,
        caption: img.caption || '',
        type: 'static',
      })),
      ...guestPhotos.map(photo => ({
        url: photo.cloudinary_url,
        caption: `Von ${photo.uploaded_by || 'Gast'}`,
        type: 'guest',
      })),
    ];
    setImages(combined);
  }, [staticImages, guestPhotos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Filter images
  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.type === filter);

  // Lightbox navigation
  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    setActiveIndex(prev => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setActiveIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, filteredImages.length]);

  const hasGuestPhotos = guestPhotos.length > 0;

  return (
    <Section ref={sectionRef} id="gallery">
      <Container>
        <Header $visible={visible}>
          <Eyebrow>Impressionen</Eyebrow>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Header>
        
        {/* Filter tabs - only show if we have both types */}
        {hasGuestPhotos && staticImages.length > 0 && (
          <FilterTabs>
            <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>
              Alle ({images.length})
            </FilterTab>
            <FilterTab $active={filter === 'static'} onClick={() => setFilter('static')}>
              Unsere Fotos ({staticImages.length})
            </FilterTab>
            <FilterTab $active={filter === 'guest'} onClick={() => setFilter('guest')}>
              Von Gästen ({guestPhotos.length})
            </FilterTab>
          </FilterTabs>
        )}
        
        {filteredImages.length === 0 ? (
          <EmptyState>
            <div className="icon">📷</div>
            <p>Noch keine Fotos vorhanden</p>
          </EmptyState>
        ) : (
          <Grid>
            {filteredImages.map((img, i) => (
              <ImageCard 
                key={i} 
                $visible={visible} 
                $index={i}
                $ratio={i % 5 === 0 ? '1/1' : '4/5'}
                onClick={() => openLightbox(i)}
              >
                {img.url ? (
                  <>
                    <img src={img.url} alt={img.caption || `Bild ${i + 1}`} loading="lazy" />
                    {img.caption && <ImageCaption>{img.caption}</ImageCaption>}
                  </>
                ) : (
                  <Placeholder>🌸</Placeholder>
                )}
              </ImageCard>
            ))}
          </Grid>
        )}
      </Container>
      
      {/* Lightbox */}
      <Lightbox $open={lightboxOpen} onClick={closeLightbox}>
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        
        {filteredImages.length > 1 && (
          <>
            <LightboxNav $direction="prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              ‹
            </LightboxNav>
            <LightboxNav $direction="next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
              ›
            </LightboxNav>
          </>
        )}
        
        {filteredImages[activeIndex] && (
          <LightboxImage 
            src={filteredImages[activeIndex].url} 
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        <LightboxCounter>
          {activeIndex + 1} / {filteredImages.length}
        </LightboxCounter>
      </Lightbox>
    </Section>
  );
}

export default Gallery;
