// Botanical MusicWishes - Compact form in hole
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';
import { submitMusicWish } from '../../lib/supabase';

const Section = styled.section`
  min-height: 100vh;
  position: relative;
  background: var(--white);
`;

const HoleContent = styled.div`
  position: absolute;
  left: ${p => p.$hole.x}%;
  top: ${p => p.$hole.y}%;
  width: ${p => p.$hole.width}%;
  height: ${p => p.$hole.height}%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  margin-bottom: 1rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem;
  font-size: 0.85rem;
  border: 1px solid var(--pale);
  background: var(--white);
  &:focus { outline: none; border-color: var(--dark); }
`;

const SubmitBtn = styled.button`
  padding: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--black);
  color: var(--white);
  border: none;
  cursor: pointer;
  &:disabled { opacity: 0.4; }
`;

const SuccessMsg = styled.div`
  text-align: center;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: var(--black);
  margin-bottom: 0.3rem;
`;

const SuccessText = styled.p`
  font-size: 0.85rem;
  color: var(--medium);
  margin-bottom: 1rem;
`;

const ResetBtn = styled.button`
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--medium);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;

function MusicWishes() {
  const { project, content } = useWedding();
  const { mainHole } = useKnotholes();
  const musicData = content?.musicwishes || {};
  
  const title = musicData.title || 'Musikwünsche';
  const description = musicData.description || 'Welcher Song bringt euch auf die Tanzfläche?';
  
  const [form, setForm] = useState({ name: '', song: '', artist: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.song || !project?.id) return;
    
    setSubmitting(true);
    try {
      await submitMusicWish(project.id, {
        name: form.name,
        song_title: form.song,
        artist: form.artist
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setForm({ name: '', song: '', artist: '' });
  };

  return (
    <Section data-section="music">
      <HoleContent $hole={mainHole}>
        {success ? (
          <SuccessMsg>
            <SuccessTitle>Danke!</SuccessTitle>
            <SuccessText>Dein Wunsch wurde gespeichert.</SuccessText>
            <ResetBtn onClick={reset}>Noch einen Song?</ResetBtn>
          </SuccessMsg>
        ) : (
          <>
            <Eyebrow>Musik</Eyebrow>
            <Title>{title}</Title>
            <Subtitle>{description}</Subtitle>
            
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Dein Name"
                required
              />
              <Input
                type="text"
                value={form.song}
                onChange={e => setForm({ ...form, song: e.target.value })}
                placeholder="Song-Titel"
                required
              />
              <Input
                type="text"
                value={form.artist}
                onChange={e => setForm({ ...form, artist: e.target.value })}
                placeholder="Künstler (optional)"
              />
              <SubmitBtn type="submit" disabled={submitting}>
                {submitting ? 'Senden...' : 'Absenden'}
              </SubmitBtn>
            </Form>
          </>
        )}
      </HoleContent>
    </Section>
  );
}

export default MusicWishes;
