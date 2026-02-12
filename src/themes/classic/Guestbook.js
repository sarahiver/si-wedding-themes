import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-cream);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;

const FormBox = styled.div`background: var(--classic-white); padding: 2rem; margin-bottom: 3rem; box-shadow: 0 2px 15px rgba(0,0,0,0.04);`;
const Input = styled.input`width: 100%; padding: 1rem; border: 1px solid var(--classic-beige); background: transparent; font-size: 0.9rem; font-weight: 300; margin-bottom: 1rem; transition: border 0.3s; &:focus { outline: none; border-color: var(--classic-gold); }`;
const Textarea = styled.textarea`width: 100%; padding: 1rem; border: 1px solid var(--classic-beige); background: transparent; font-size: 0.9rem; font-weight: 300; min-height: 120px; resize: vertical; margin-bottom: 1rem; transition: border 0.3s; &:focus { outline: none; border-color: var(--classic-gold); }`;
const SubmitBtn = styled.button`padding: 1rem 2.5rem; background: var(--classic-gold); border: none; color: #fff; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; transition: background 0.3s; &:hover { background: var(--classic-gold-dark); } &:disabled { opacity: 0.5; }`;

const EntryCard = styled.div`padding: 1.5rem 0; border-bottom: 1px solid var(--classic-border);`;
const EntryName = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-weight: 500; margin-bottom: 0.3rem;`;
const EntryDate = styled.p`font-size: 0.7rem; color: var(--classic-text-muted); margin-bottom: 0.75rem;`;
const EntryMsg = styled.p`font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); line-height: 1.7; font-style: italic;`;

function Guestbook() {
  const { content } = useWedding();
  const gb = content?.guestbook || {};
  const { entries, newEntry, updateNewEntry, submitEntry, submitting, feedback, closeFeedback } = useGuestbook();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const title = gb.title || 'Gästebuch';
  const handleSubmit = async (e) => { e.preventDefault(); await submitEntry(); };
  return (
    <Section id="guestbook" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Eure Worte</Eyebrow><Title $v={visible}>{title}</Title></Header>
        <FormBox>
          <form onSubmit={handleSubmit}>
            <Input placeholder="Euer Name" value={newEntry.name || ''} onChange={e => updateNewEntry('name', e.target.value)} required />
            <Textarea placeholder="Eure Nachricht an das Brautpaar..." value={newEntry.message || ''} onChange={e => updateNewEntry('message', e.target.value)} required />
            <SubmitBtn type="submit" disabled={submitting}>{submitting ? 'Wird gesendet...' : 'Eintragen'}</SubmitBtn>
          </form>
        </FormBox>
        {entries?.map((entry, i) => (
          <EntryCard key={entry.id || i}>
            <EntryName>{entry.name}</EntryName>
            <EntryDate>{new Date(entry.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</EntryDate>
            <EntryMsg>"{entry.message}"</EntryMsg>
          </EntryCard>
        ))}
      </Container>
      <FeedbackModal {...feedback} onClose={closeFeedback} />
    </Section>
  );
}
export default Guestbook;
