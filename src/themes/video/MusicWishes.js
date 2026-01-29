import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Content = styled.div`text-align: center; max-width: 450px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.2s;
`;

const Input = styled.input`
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--video-white);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  text-align: center;
  
  &:focus { outline: none; border-color: var(--video-accent); }
  &::placeholder { color: var(--video-gray); }
`;

const Button = styled.button`
  padding: 1rem;
  font-family: var(--font-primary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-white);
  background: var(--video-accent);
  
  &:hover { background: var(--video-accent-light); }
  &:disabled { background: var(--video-gray); }
`;

const Success = styled.div`text-align: center; opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessTitle = styled.h3`font-family: var(--font-accent); font-size: 2rem; font-style: italic; color: var(--video-white); margin-bottom: 0.5rem;`;
const SuccessText = styled.p`font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-silver);`;

function MusicWishes() {
  const { project, content } = useWedding();
  const title = content?.musicwishes?.title || 'Musikwuensche';
  
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);
    try {
      await submitMusicWish(project.id, { name, song_title: song, artist });
      setSubmitted(true);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <SectionWrapper id="
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Playlist</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        {submitted ? (
          <Success><SuccessTitle>Danke!</SuccessTitle><SuccessText>Wir haben euren Songwunsch erhalten.</SuccessText></Success>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <Input type="text" placeholder="Euer Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input type="text" placeholder="Songtitel" value={song} onChange={e => setSong(e.target.value)} required />
            <Input type="text" placeholder="Kuenstler (optional)" value={artist} onChange={e => setArtist(e.target.value)} />
            <Button type="submit" disabled={loading}>{loading ? 'Wird gesendet...' : 'Vorschlagen'}</Button>
          </Form>
        )}
      </Content>
    </SectionWrapper>
  );
}

export default MusicWishes;
