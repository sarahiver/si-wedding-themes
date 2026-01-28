// Contemporary MusicWishes
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const bounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
`;

const Section = styled.section`
  padding: clamp(4rem, 10vh, 8rem) 2rem;
  background: var(--purple);
  position: relative;
  overflow: hidden;
`;

const FloatingNote = styled.div`
  position: absolute;
  font-size: 3rem;
  opacity: 0.2;
  animation: ${bounce} 3s ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--yellow);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--white);
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.5rem;
`;

const Card = styled.div`
  background: var(--white);
  border: 4px solid var(--black);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: var(--gray-100);
  border: 3px solid var(--black);
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--purple);
  color: var(--white);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: var(--shadow-lg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const SuccessText = styled.p`
  color: var(--gray-600);
  margin-top: 0.5rem;
`;

const ResetButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--gray-100);
  border: 2px solid var(--black);
  cursor: pointer;
  
  &:hover {
    background: var(--gray-200);
  }
`;

function MusicWishes() {
  const { project, content } = useWedding();
  const musicData = content?.musicwishes || {};
  
  const title = musicData.title || 'Musikwünsche';
  const description = musicData.description || 'Welcher Song bringt dich auf die Tanzfläche?';
  
  const [formData, setFormData] = useState({ name: '', song: '', artist: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.song || !project?.id) return;
    
    setIsSubmitting(true);
    try {
      await submitMusicWish(project.id, {
        name: formData.name,
        song_title: formData.song,
        artist: formData.artist
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setFormData({ name: '', song: '', artist: '' });
  };

  return (
    <Section id="music">
      <FloatingNote style={{ top: '10%', left: '5%' }} $delay="0s">🎵</FloatingNote>
      <FloatingNote style={{ top: '20%', right: '10%' }} $delay="0.5s">🎶</FloatingNote>
      <FloatingNote style={{ bottom: '15%', left: '10%' }} $delay="1s">🎤</FloatingNote>
      <FloatingNote style={{ bottom: '25%', right: '5%' }} $delay="1.5s">🎸</FloatingNote>
      
      <Container>
        <Header>
          <Eyebrow>🎵 Music Request</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <Card>
          {success ? (
            <SuccessMessage>
              <SuccessEmoji>🎉</SuccessEmoji>
              <SuccessTitle>Rock on!</SuccessTitle>
              <SuccessText>Dein Songwunsch wurde gespeichert. See you on the dancefloor!</SuccessText>
              <ResetButton onClick={handleReset}>Noch einen Song?</ResetButton>
            </SuccessMessage>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Dein Name *</Label>
                <Input 
                  type="text" 
                  placeholder="Wer wünscht sich was?" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Song *</Label>
                <Input 
                  type="text" 
                  placeholder="z.B. Dancing Queen" 
                  value={formData.song}
                  onChange={e => setFormData({ ...formData, song: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Künstler/Band</Label>
                <Input 
                  type="text" 
                  placeholder="z.B. ABBA" 
                  value={formData.artist}
                  onChange={e => setFormData({ ...formData, artist: e.target.value })}
                />
              </FormGroup>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '🎵 Wird gesendet...' : '🎵 Song wünschen'}
              </Button>
            </form>
          )}
        </Card>
      </Container>
    </Section>
  );
}

export default MusicWishes;
