import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  position: relative;
  z-index: 10;
  padding: var(--section-padding) 2rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 300;
  color: var(--text-light);
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.1s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-style: italic;
  color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.2s;
  `}
`;

const FormSection = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--glass-shadow);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
  
  /* Top highlight */
  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255,255,255,0.15) 20%, 
      rgba(255,255,255,0.25) 50%, 
      rgba(255,255,255,0.15) 80%, 
      transparent 100%
    );
    pointer-events: none;
  }
`;

const FormTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  span {
    animation: ${bounce} 1s ease infinite;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-light);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
  
  &::placeholder {
    color: var(--text-dim);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WishesSection = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const WishesHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const WishesTitle = styled.h3`
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 400;
  color: var(--text-light);
`;

const WishesCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.75rem;
  border-radius: 50px;
`;

const WishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  
  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 1rem;
    margin: 0 -1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const WishCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  border-left: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
  
  @media (max-width: 600px) {
    flex-shrink: 0;
    width: 75vw;
    max-width: 280px;
    scroll-snap-align: start;
  }
`;

const SongTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0.25rem;
`;

const Artist = styled.p`
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-style: italic;
  color: var(--text-muted);
  margin: 0;
`;

const WishMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const WishName = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--text-dim);
`;

const SpotifyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 0.9rem 1.75rem;
  background: #1DB954;
  border-radius: 50px;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(29, 185, 84, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
`;

const EmptyIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--text-muted);
`;

// ============================================
// COMPONENT
// ============================================

function MusicWishes() {
  const { content } = useWedding();
  const musicData = content?.musicwishes || {};
  
  const title = musicData.title || 'Musikwünsche';
  const description = musicData.description || 'Welcher Song bringt euch auf die Tanzfläche?';
  const spotifyPlaylist = musicData.spotify_playlist || '';
  
  const {
    wishes,
    formData,
    submitting,
    error,
    success,
    updateField,
    submitWish,
  } = useMusicWishes();
  
  const [visible, setVisible] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Danke für deinen Musikwunsch! 🎵',
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setModalState({
        isOpen: true,
        type: 'error',
        message: error,
      });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitWish();
  };

  return (
    <Section id="musicwishes" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Eure Playlist</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <FormSection $visible={visible}>
          <FormTitle><span>🎵</span> Song wünschen</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Dein Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Wer wünscht?"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Künstler *</Label>
                <Input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => updateField('artist', e.target.value)}
                  placeholder="Band oder Sänger/in"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Songtitel *</Label>
                <Input
                  type="text"
                  value={formData.songTitle}
                  onChange={(e) => updateField('songTitle', e.target.value)}
                  placeholder="Name des Songs"
                  required
                />
              </FormGroup>
            </FormGrid>
            
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Wird gesendet...' : '🎤 Wunsch absenden'}
            </SubmitButton>
          </form>
        </FormSection>
        
        <WishesSection $visible={visible}>
          <WishesHeader>
            <WishesTitle>Gewünschte Songs</WishesTitle>
            <WishesCount>{wishes.length} Wünsche</WishesCount>
          </WishesHeader>
          
          {wishes.length > 0 ? (
            <WishesGrid>
              {wishes.map(wish => (
                <WishCard key={wish.id}>
                  <SongTitle>{wish.song_title}</SongTitle>
                  <Artist>{wish.artist}</Artist>
                  <WishMeta>
                    <WishName>von {wish.name}</WishName>
                  </WishMeta>
                </WishCard>
              ))}
            </WishesGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>🎶</EmptyIcon>
              <EmptyText>Noch keine Wünsche – welcher Song muss gespielt werden?</EmptyText>
            </EmptyState>
          )}
          
          {spotifyPlaylist && (
            <SpotifyLink href={spotifyPlaylist} target="_blank" rel="noopener noreferrer">
              🎧 Zur Spotify Playlist
            </SpotifyLink>
          )}
        </WishesSection>
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={modalState.type === 'success' ? 3000 : 0}
      />
    </Section>
  );
}

export default MusicWishes;
