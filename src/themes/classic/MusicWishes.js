import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useMusicWishes } from '../../components/shared/MusicWishesCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-white);`;
const Container = styled.div`max-width: 650px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.25s;`}`;

const FormBox = styled.div`background: var(--classic-cream); padding: 2rem; margin-bottom: 2rem;`;
const Input = styled.input`width: 100%; padding: 1rem; border: 1px solid var(--classic-beige); background: var(--classic-white); font-size: 0.9rem; font-weight: 300; margin-bottom: 1rem; &:focus { outline: none; border-color: var(--classic-gold); }`;
const SubmitBtn = styled.button`width: 100%; padding: 1rem; background: var(--classic-gold); border: none; color: #fff; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; &:hover { background: var(--classic-gold-dark); } &:disabled { opacity: 0.5; }`;
const WishItem = styled.div`padding: 1rem 0; border-bottom: 1px solid var(--classic-border); display: flex; justify-content: space-between; align-items: center;`;
const WishSong = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-weight: 400;`;
const WishArtist = styled.p`font-size: 0.8rem; color: var(--classic-text-muted);`;
const WishName = styled.p`font-size: 0.75rem; color: var(--classic-text-muted); font-style: italic;`;

function MusicWishes() {
  const { content } = useWedding();
  const mw = content?.musicwishes || {};
  const { wishes, newWish, updateNewWish, submitWish, submitting, feedback, closeFeedback } = useMusicWishes();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = mw.title || 'Musikwünsche';
  const desc = mw.description || 'Welche Songs dürfen auf unserer Hochzeit nicht fehlen?';
  const handleSubmit = async (e) => { e.preventDefault(); await submitWish(); };
  return (
    <Section id="musicwishes" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Playlist</Eyebrow><Title $v={visible}>{title}</Title><Desc $v={visible}>{desc}</Desc></Header>
        <FormBox>
          <form onSubmit={handleSubmit}>
            <Input placeholder="Song-Titel" value={newWish.song || ''} onChange={e => updateNewWish('song', e.target.value)} required />
            <Input placeholder="Interpret" value={newWish.artist || ''} onChange={e => updateNewWish('artist', e.target.value)} />
            <Input placeholder="Euer Name" value={newWish.name || ''} onChange={e => updateNewWish('name', e.target.value)} />
            <SubmitBtn type="submit" disabled={submitting}>{submitting ? 'Wird gesendet...' : 'Wünschen'}</SubmitBtn>
          </form>
        </FormBox>
        {wishes?.map((w, i) => (
          <WishItem key={w.id || i}><div><WishSong>{w.song}</WishSong>{w.artist && <WishArtist>{w.artist}</WishArtist>}</div>{w.name && <WishName>— {w.name}</WishName>}</WishItem>
        ))}
      </Container>
      <FeedbackModal {...feedback} onClose={closeFeedback} />
    </Section>
  );
}
export default MusicWishes;
