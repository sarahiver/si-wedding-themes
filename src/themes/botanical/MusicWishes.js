// Botanical MusicWishes - Nature-Inspired Song Request
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(
    180deg,
    var(--green-fern) 0%,
    var(--green-moss) 100%
  );
  position: relative;
  overflow: hidden;
`;

const FloatingNote = styled.div`
  position: absolute;
  font-size: ${p => p.$size || '2.5rem'};
  opacity: 0.2;
  animation: ${float} ${p => p.$duration || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-tight);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-mint);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  color: var(--bg-cream);
  text-shadow: 0 3px 15px rgba(0,0,0,0.2);
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--green-mint);
  margin-top: 0.5rem;
  opacity: 0.9;
`;

const FormCard = styled.div`
  background: var(--bg-cream);
  padding: clamp(2rem, 6vw, 3rem);
  border-radius: 40px 40px 35px 45px / 35px 45px 40px 40px;
  box-shadow: var(--shadow-deep);
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--bg-fog);
  border: 2px solid var(--bg-moss);
  border-radius: 25px;
  color: var(--text-dark);
  transition: all 0.3s var(--ease-nature);
  
  &:focus {
    outline: none;
    border-color: var(--green-fern);
    box-shadow: 0 0 0 4px rgba(92, 138, 77, 0.15);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, var(--green-fern) 0%, var(--green-forest) 100%);
  color: var(--bg-cream);
  border: none;
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  transition: all 0.4s var(--ease-nature);
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-deep), var(--shadow-glow);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${sway} 3s ease-in-out infinite;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 2rem;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: var(--text-medium);
  margin-bottom: 1.5rem;
`;

const ResetButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--bg-fog);
  border: 2px solid var(--bg-moss);
  border-radius: 25px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--green-forest);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--green-mint);
  }
`;

function MusicWishes() {
  const { project, content } = useWedding();
  const musicData = content?.musicwishes || {};
  
  const title = musicData.title || 'Musikwünsche';
  const description = musicData.description || 'Welcher Song bringt euch auf die Tanzfläche?';
  
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
      {/* Floating music notes */}
      <FloatingNote style={{ top: '15%', left: '8%' }} $duration="10s">🎵</FloatingNote>
      <FloatingNote style={{ top: '25%', right: '12%' }} $size="3rem" $duration="12s" $delay="-3s">🎶</FloatingNote>
      <FloatingNote style={{ bottom: '20%', left: '10%' }} $size="2rem" $duration="9s" $delay="-5s">🎸</FloatingNote>
      <FloatingNote style={{ bottom: '30%', right: '8%' }} $duration="11s" $delay="-2s">🎤</FloatingNote>
      
      <Container>
        <Header>
          <Eyebrow>🎵 Musik</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <FormCard>
          {success ? (
            <SuccessCard>
              <SuccessEmoji>🎉</SuccessEmoji>
              <SuccessTitle>Perfekt!</SuccessTitle>
              <SuccessText>Dein Songwunsch wurde gespeichert. Wir sehen uns auf der Tanzfläche!</SuccessText>
              <ResetButton onClick={handleReset}>Noch einen Song?</ResetButton>
            </SuccessCard>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Dein Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Wer wünscht sich den Song?"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Song-Titel *</Label>
                <Input
                  type="text"
                  value={formData.song}
                  onChange={e => setFormData({ ...formData, song: e.target.value })}
                  placeholder="z.B. Dancing Queen"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Künstler / Band</Label>
                <Input
                  type="text"
                  value={formData.artist}
                  onChange={e => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="z.B. ABBA"
                />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '🎵 Wird gesendet...' : '🎵 Song wünschen'}
              </SubmitButton>
            </form>
          )}
        </FormCard>
      </Container>
    </Section>
  );
}

export default MusicWishes;
