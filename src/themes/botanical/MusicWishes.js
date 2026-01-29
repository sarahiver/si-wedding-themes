import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';
import { submitMusicWish } from '../../lib/supabase';

const Desc = styled.p`font-size: 0.85rem; color: var(--medium); text-align: center; margin-bottom: 1rem;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 0.5rem;`;
const Input = styled.input`padding: 0.65rem; font-size: 0.9rem; border: 1px solid var(--pale); &:focus { outline: none; border-color: var(--dark); }`;
const SubmitBtn = styled.button`padding: 0.75rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--black); color: var(--white); cursor: pointer; &:disabled { opacity: 0.4; }`;
const Success = styled.div`text-align: center; h3 { font-family: var(--font-serif); font-size: 1.3rem; margin-bottom: 0.3rem; } p { font-size: 0.85rem; color: var(--medium); }`;
const ResetBtn = styled.button`margin-top: 1rem; font-size: 0.75rem; color: var(--medium); background: none; text-decoration: underline; cursor: pointer;`;

function MusicWishes({ side = 'right' }) {
  const { project, content } = useWedding();
  const d = content?.musicwishes || {};
  const [form, setForm] = useState({ name: '', song: '', artist: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.song || !project?.id) return;
    setSubmitting(true);
    try { await submitMusicWish(project.id, { name: form.name, song_title: form.song, artist: form.artist }); setSuccess(true); } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  if (success) return <ContentBranch side={side} eyebrow="Musik" title="Danke!"><Success><p>Dein Wunsch wurde gespeichert.</p><ResetBtn onClick={() => { setSuccess(false); setForm({ name: '', song: '', artist: '' }); }}>Noch einen Song?</ResetBtn></Success></ContentBranch>;

  return (
    <ContentBranch side={side} eyebrow="Musik" title={d.title || 'Musikwünsche'}>
      <Desc>{d.description || 'Welcher Song bringt euch auf die Tanzfläche?'}</Desc>
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dein Name" required />
        <Input type="text" value={form.song} onChange={e => setForm({ ...form, song: e.target.value })} placeholder="Song-Titel" required />
        <Input type="text" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} placeholder="Künstler (optional)" />
        <SubmitBtn type="submit" disabled={submitting}>{submitting ? 'Senden...' : 'Absenden'}</SubmitBtn>
      </Form>
    </ContentBranch>
  );
}
export default MusicWishes;
