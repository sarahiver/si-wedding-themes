// Botanical MusicWishes - Clean song request form
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream-dark);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 450px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--bark-medium);
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  background: var(--warm-white);
  border: 1px solid var(--cream);
  color: var(--soft-black);
  
  &:focus {
    outline: none;
    border-color: var(--forest-light);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--forest-deep);
  color: var(--cream);
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover:not(:disabled) {
    background: var(--forest-main);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--bark-medium);
`;

const ResetButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid var(--bark-light);
  color: var(--bark-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--forest-light);
    color: var(--forest-deep);
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

  if (success) {
    return (
      <Section id="music" data-section="music">
        <Content>
          <SuccessMessage>
            <SuccessTitle>Danke!</SuccessTitle>
            <SuccessText>Dein Musikwunsch wurde gespeichert.</SuccessText>
            <ResetButton onClick={handleReset}>Noch einen Song?</ResetButton>
          </SuccessMessage>
        </Content>
      </Section>
    );
  }

  return (
    <Section id="music" data-section="music">
      <Content>
        <Header>
          <Eyebrow>Musik</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Dein Name"
            required
          />
          <Input
            type="text"
            value={formData.song}
            onChange={e => setFormData({ ...formData, song: e.target.value })}
            placeholder="Song-Titel"
            required
          />
          <Input
            type="text"
            value={formData.artist}
            onChange={e => setFormData({ ...formData, artist: e.target.value })}
            placeholder="Künstler (optional)"
          />
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wird gesendet...' : 'Absenden'}
          </SubmitButton>
        </Form>
      </Content>
    </Section>
  );
}

export default MusicWishes;
