import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-black);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
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
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: var(--editorial-white);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: clamp(2rem, 5vw, 3rem);
  margin-bottom: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const FormTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-white);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: var(--editorial-red);
  color: var(--editorial-white);
  border: none;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  
  &:hover:not(:disabled) {
    background: #e01a38;
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
    animation-delay: 0.5s;
  `}
`;

const WishesTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
  margin-bottom: 0.5rem;
`;

const WishesCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin: 1.5rem 0 2rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.6s;
  `}
`;

const WishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 2rem;
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const WishCard = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid var(--editorial-red);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(5px);
  }
  
  @media (max-width: 768px) {
    flex-shrink: 0;
    width: 75vw;
    max-width: 280px;
    scroll-snap-align: start;
  }
`;

const SongTitle = styled.h4`
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-white);
  margin-bottom: 0.25rem;
`;

const Artist = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const WishMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const WishName = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
`;

const SpotifyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding: 1rem 2rem;
  background: #1DB954;
  color: var(--editorial-white);
  font-family: var(--font-headline);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(29, 185, 84, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
`;

const EmptyIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
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
          <WishesTitle>Gewünschte Songs</WishesTitle>
          <WishesCount>{wishes.length} Wünsche</WishesCount>
          <Divider $visible={visible} />
          
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
