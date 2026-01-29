import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const Form = styled.form`display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;`;
const Input = styled.input`padding: 0.65rem; font-size: 0.9rem; border: 1px solid var(--pale); &:focus { outline: none; border-color: var(--dark); }`;
const TextArea = styled.textarea`padding: 0.65rem; font-size: 0.9rem; border: 1px solid var(--pale); min-height: 70px; resize: none; &:focus { outline: none; border-color: var(--dark); }`;
const SubmitBtn = styled.button`padding: 0.7rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--black); color: var(--white); cursor: pointer; &:disabled { opacity: 0.4; }`;
const SuccessMsg = styled.p`font-size: 0.85rem; color: var(--medium); text-align: center; padding: 0.5rem; background: var(--off-white); margin-bottom: 1rem;`;
const EntriesList = styled.div`max-height: 200px; overflow-y: auto;`;
const Entry = styled.div`padding: 0.6rem 0; border-bottom: 1px solid var(--off-white);`;
const EntryName = styled.p`font-size: 0.85rem; font-weight: 600; color: var(--black);`;
const EntryMsg = styled.p`font-size: 0.85rem; color: var(--medium); line-height: 1.5; margin-top: 0.2rem;`;

function Guestbook({ side = 'left' }) {
  const { project, content } = useWedding();
  const title = content?.guestbook?.title || 'Gästebuch';
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (project?.id) loadEntries(); }, [project?.id]);
  const loadEntries = async () => { const { data } = await getGuestbookEntries(project.id); if (data) setEntries(data); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message || !project?.id) return;
    setSubmitting(true);
    try { await submitGuestbookEntry(project.id, form); setSuccess(true); setForm({ name: '', message: '' }); loadEntries(); setTimeout(() => setSuccess(false), 3000); } catch (err) { console.error(err); }
    setSubmitting(false);
  };

  return (
    <ContentBranch side={side} eyebrow="Hinterlasst uns" title={title}>
      {success && <SuccessMsg>Danke für deinen Eintrag!</SuccessMsg>}
      <Form onSubmit={handleSubmit}>
        <Input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dein Name" required />
        <TextArea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Deine Nachricht..." required />
        <SubmitBtn type="submit" disabled={submitting}>{submitting ? 'Senden...' : 'Absenden'}</SubmitBtn>
      </Form>
      <EntriesList>{entries.length === 0 ? <p style={{fontSize:'0.8rem',color:'var(--light)',textAlign:'center'}}>Noch keine Einträge</p> : entries.map((e,i) => <Entry key={i}><EntryName>{e.name}</EntryName><EntryMsg>{e.message}</EntryMsg></Entry>)}</EntriesList>
    </ContentBranch>
  );
}
export default Guestbook;
