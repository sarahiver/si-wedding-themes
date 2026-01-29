import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: linear-gradient(180deg, var(--botanical-cream) 0%, var(--botanical-mint) 100%);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Form = styled.form`background: white; border-radius: 24px; padding: 2rem; box-shadow: 0 10px 30px rgba(107, 127, 94, 0.15); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s;`;
const Input = styled.input`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-charcoal); background: var(--botanical-paper); border: 2px solid var(--botanical-mint); border-radius: 12px; margin-bottom: 1rem; text-align: center; &:focus { outline: none; border-color: var(--botanical-sage); }`;
const Button = styled.button`padding: 1rem 2rem; font-family: var(--font-handwritten); font-size: 1.1rem; color: white; background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive)); border-radius: 50px; cursor: pointer; &:hover { transform: translateY(-2px); }`;

const Success = styled.div`padding: 2rem; background: white; border-radius: 24px; opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessIcon = styled.div`font-size: 3rem; margin-bottom: 1rem;`;
const SuccessText = styled.p`font-family: var(--font-handwritten); font-size: 1.5rem; color: var(--botanical-forest);`;

function MusicWishes() {
  const { project, content } = useWedding();
  const title = content?.musicwishes?.title || 'Musikwuensche';
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id) return;
    try {
      await submitMusicWish(project.id, { name, song_title: song, artist });
      setSubmitted(true);
    } catch (err) { console.error(err); }
  };

  return (
    <Section ref={sectionRef} id="music">
      <Container>
        <Eyebrow $visible={visible}>🎵 Playlist</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        {submitted ? (
          <Success><SuccessIcon>🎶</SuccessIcon><SuccessText>Danke fuer euren Song!</SuccessText></Success>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <Input type="text" placeholder="Euer Name 🌿" value={name} onChange={e => setName(e.target.value)} required />
            <Input type="text" placeholder="Songtitel 🎵" value={song} onChange={e => setSong(e.target.value)} required />
            <Input type="text" placeholder="Kuenstler 🎤" value={artist} onChange={e => setArtist(e.target.value)} />
            <Button type="submit">🎶 Vorschlagen</Button>
          </Form>
        )}
      </Container>
    </Section>
  );
}

export default MusicWishes;
