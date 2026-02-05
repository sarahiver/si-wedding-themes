import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 600px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const Input = styled.input`padding: 1rem; font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-white); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); &:focus { outline: none; border-color: var(--video-accent); } &::placeholder { color: var(--video-gray); }`;
const TextArea = styled.textarea`padding: 1rem; font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-white); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); min-height: 80px; resize: vertical; &:focus { outline: none; border-color: var(--video-accent); }`;
const Button = styled.button`padding: 1rem; font-family: var(--font-primary); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--video-white); background: var(--video-accent); &:hover { background: var(--video-accent-light); } &:disabled { background: var(--video-gray); }`;
const EntriesList = styled.div`display: flex; flex-direction: column; gap: 1.5rem; text-align: left; max-height: 200px; overflow-y: auto;`;
const Entry = styled.div`padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.3 + p.$index * 0.1}s;`;
const EntryName = styled.span`font-family: var(--font-primary); font-size: 0.8rem; font-weight: 600; color: var(--video-accent);`;
const EntryMessage = styled.p`font-family: var(--font-accent); font-size: 0.95rem; font-style: italic; color: var(--video-silver); margin-top: 0.25rem;`;

function Guestbook() {
  const { project, content } = useWedding();
  const title = content?.guestbook?.title || 'Gaestebuch';
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (project?.id) getGuestbookEntries(project.id).then(data => setEntries(Array.isArray(data) ? data : []));
  }, [project?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id || !name || !message) return;
    setLoading(true);
    try {
      await submitGuestbookEntry(project.id, { name, message });
      setName(''); setMessage('');
      const data = await getGuestbookEntries(project.id);
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <SectionWrapper id="guestbook">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Eure Worte</Eyebrow>
        <Title $visible={visible}>{title}</Title>
        <Form onSubmit={handleSubmit} $visible={visible}>
          <Input type="text" placeholder="Euer Name" value={name} onChange={e => setName(e.target.value)} required />
          <TextArea placeholder="Eure Nachricht..." value={message} onChange={e => setMessage(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? 'Wird gesendet...' : 'Eintragen'}</Button>
        </Form>
        <EntriesList>
          {entries.slice(0, 5).map((entry, i) => (
            <Entry key={entry.id || i} $visible={visible} $index={i}>
              <EntryName>{entry.name}</EntryName>
              <EntryMessage>"{entry.message}"</EntryMessage>
            </Entry>
          ))}
        </EntriesList>
      </Content>
    </SectionWrapper>
  );
}

export default Guestbook;
