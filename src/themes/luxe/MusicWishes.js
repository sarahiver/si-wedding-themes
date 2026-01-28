// Luxe MusicWishes
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitMusicWish } from '../../lib/supabase';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-cream);`;
const Container = styled.div`max-width: 500px; margin: 0 auto; text-align: center;`;

const Header = styled.div`margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Form = styled.form`opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-sans); font-size: 1rem; color: var(--luxe-black); background: var(--luxe-white); border: 1px solid var(--luxe-sand); margin-bottom: 1rem; text-align: center; &:focus { outline: none; border-color: var(--luxe-olive); }`;
const Button = styled.button`padding: 1rem 2rem; font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-white); background: var(--luxe-black); border: none; cursor: pointer; margin-top: 0.5rem; &:hover { background: var(--luxe-charcoal); }`;

const Success = styled.div`padding: 2rem; opacity: 0; animation: ${slideInLeft} 0.8s var(--transition-slow) forwards;`;
const SuccessText = styled.p`font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: var(--luxe-black);`;

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
        <Header $visible={visible}><Eyebrow>Playlist</Eyebrow><Title>{title}</Title></Header>
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
