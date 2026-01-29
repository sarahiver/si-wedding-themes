// Botanical Guestbook - Write/Read in holes
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

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
  justify-content: flex-start;
  padding: 1.5rem 1rem;
  overflow: hidden;
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
  margin-bottom: 0.75rem;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  font-size: 0.85rem;
  border: 1px solid var(--pale);
  background: var(--white);
  &:focus { outline: none; border-color: var(--dark); }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.6rem;
  font-size: 0.85rem;
  border: 1px solid var(--pale);
  background: var(--white);
  min-height: 70px;
  resize: none;
  &:focus { outline: none; border-color: var(--dark); }
`;

const SubmitBtn = styled.button`
  padding: 0.7rem;
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

const SuccessMsg = styled.p`
  font-size: 0.8rem;
  color: var(--medium);
  text-align: center;
  padding: 0.5rem;
  background: var(--off-white);
`;

const EntriesList = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const Entry = styled.div`
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--off-white);
  text-align: left;
  &:last-child { border-bottom: none; }
`;

const EntryName = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--black);
`;

const EntryMsg = styled.p`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--medium);
  line-height: 1.5;
  margin-top: 0.2rem;
`;

const EntryDate = styled.p`
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: var(--light);
  margin-top: 0.2rem;
`;

const SmallTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const EmptyState = styled.p`
  font-size: 0.8rem;
  color: var(--light);
  text-align: center;
  padding: 1rem;
`;

function Guestbook() {
  const { project, content } = useWedding();
  const { mainHole, secondaryHoles } = useKnotholes();
  const guestbookData = content?.guestbook || {};
  
  const title = guestbookData.title || 'Gästebuch';
  
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (project?.id) loadEntries();
  }, [project?.id]);

  const loadEntries = async () => {
    const { data } = await getGuestbookEntries(project.id);
    if (data) setEntries(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message || !project?.id) return;
    
    setSubmitting(true);
    try {
      await submitGuestbookEntry(project.id, form);
      setSuccess(true);
      setForm({ name: '', message: '' });
      loadEntries();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const hasSecondary = secondaryHoles.length > 0;

  return (
    <Section data-section="guestbook">
      {/* Main hole: Form (or form + entries if no secondary) */}
      <HoleContent $hole={mainHole}>
        <Eyebrow>Hinterlasst uns</Eyebrow>
        <Title>{title}</Title>
        
        {success && <SuccessMsg>Danke für deinen Eintrag!</SuccessMsg>}
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Dein Name"
            required
          />
          <TextArea
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            placeholder="Deine Nachricht..."
            required
          />
          <SubmitBtn type="submit" disabled={submitting}>
            {submitting ? 'Senden...' : 'Absenden'}
          </SubmitBtn>
        </Form>
        
        {/* Show entries here if no secondary hole */}
        {!hasSecondary && (
          <EntriesList style={{ marginTop: '1rem' }}>
            {entries.length === 0 ? (
              <EmptyState>Noch keine Einträge</EmptyState>
            ) : (
              entries.slice(0, 3).map((e, i) => (
                <Entry key={i}>
                  <EntryName>{e.name}</EntryName>
                  <EntryMsg>{e.message}</EntryMsg>
                </Entry>
              ))
            )}
          </EntriesList>
        )}
      </HoleContent>
      
      {/* Secondary hole: Entries */}
      {hasSecondary && (
        <HoleContent $hole={secondaryHoles[0]}>
          <SmallTitle>Einträge</SmallTitle>
          <EntriesList>
            {entries.length === 0 ? (
              <EmptyState>Noch keine</EmptyState>
            ) : (
              entries.map((e, i) => (
                <Entry key={i}>
                  <EntryName>{e.name}</EntryName>
                  <EntryMsg>{e.message}</EntryMsg>
                  <EntryDate>{new Date(e.created_at).toLocaleDateString('de-DE')}</EntryDate>
                </Entry>
              ))
            )}
          </EntriesList>
        </HoleContent>
      )}
    </Section>
  );
}

export default Guestbook;
