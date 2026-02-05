import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: 450px; margin: 0 auto; text-align: center;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Form = styled.form`opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); margin-bottom: 1rem; text-align: center; &:focus { outline: none; border-color: var(--luxe-gold); }`;
const Button = styled.button`padding: 1rem 2rem; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-void); background: var(--luxe-gold); margin-top: 0.5rem; &:hover { background: var(--luxe-champagne); }`;

const Success = styled.div`padding: 2rem; opacity: 0; animation: ${fadeIn} 0.8s ease forwards;`;
const SuccessText = styled.p`font-family: var(--font-display); font-size: 1.5rem; font-style: italic; color: var(--luxe-cream);`;

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
        <Eyebrow $visible={visible}>Playlist</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        {submitted ? (
          <Success><SuccessText>Danke fuer euren Vorschlag!</SuccessText></Success>
        ) : (
          <Form onSubmit={handleSubmit} $visible={visible}>
            <Input type="text" placeholder="Euer Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input type="text" placeholder="Songtitel" value={song} onChange={e => setSong(e.target.value)} required />
            <Input type="text" placeholder="Kuenstler" value={artist} onChange={e => setArtist(e.target.value)} />
            <Button type="submit">Vorschlagen</Button>
          </Form>
        )}
      </Container>
    </Section>
  );
}

export default MusicWishes;
