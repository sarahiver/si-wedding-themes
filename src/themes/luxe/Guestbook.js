// Luxe Guestbook
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const slideInLeft = keyframes`from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); }`;
const slideInRight = keyframes`from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--luxe-white);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 3rem; opacity: 0; animation: ${p => p.$visible ? slideInLeft : 'none'} 0.8s var(--transition-slow) forwards;`;
const Eyebrow = styled.p`font-family: var(--font-sans); font-size: 0.7rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--luxe-taupe); margin-bottom: 1rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; font-style: italic; color: var(--luxe-black);`;

const Form = styled.form`margin-bottom: 4rem; padding: 2rem; background: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? slideInRight : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: 0.2s;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-sans); font-size: 1rem; color: var(--luxe-black); background: var(--luxe-white); border: 1px solid var(--luxe-sand); margin-bottom: 1rem; &:focus { outline: none; border-color: var(--luxe-olive); }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: var(--font-sans); font-size: 1rem; color: var(--luxe-black); background: var(--luxe-white); border: 1px solid var(--luxe-sand); min-height: 120px; resize: vertical; margin-bottom: 1rem; &:focus { outline: none; border-color: var(--luxe-olive); }`;
const Button = styled.button`padding: 1rem 2rem; font-family: var(--font-sans); font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-white); background: var(--luxe-black); border: none; cursor: pointer; &:hover { background: var(--luxe-charcoal); } &:disabled { background: var(--luxe-taupe); }`;

const EntriesList = styled.div`display: flex; flex-direction: column; gap: 2rem;`;
const Entry = styled.div`padding-bottom: 2rem; border-bottom: 1px solid var(--luxe-sand); opacity: 0; animation: ${p => p.$visible ? (p.$index % 2 === 0 ? slideInLeft : slideInRight) : 'none'} 0.8s var(--transition-slow) forwards; animation-delay: ${p => 0.3 + p.$index * 0.1}s; &:last-child { border-bottom: none; }`;
const EntryName = styled.p`font-family: var(--font-serif); font-size: 1.1rem; font-weight: 500; color: var(--luxe-black); margin-bottom: 0.5rem;`;
const EntryMessage = styled.p`font-family: var(--font-sans); font-size: 0.9rem; font-weight: 300; line-height: 1.8; color: var(--luxe-charcoal); font-style: italic;`;
const EntryDate = styled.span`font-family: var(--font-sans); font-size: 0.7rem; color: var(--luxe-taupe); display: block; margin-top: 0.75rem;`;

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
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (project?.id) getGuestbookEntries(project.id).then(data => data && setEntries(data));
  }, [project?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id || !name || !message) return;
    setLoading(true);
    try {
      await submitGuestbookEntry(project.id, { name, message });
      setName(''); setMessage('');
      const data = await getGuestbookEntries(project.id);
      if (data) setEntries(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <Section ref={sectionRef} id="guestbook">
      <Container>
        <Header $visible={visible}><Eyebrow>Eure Worte</Eyebrow><Title>{title}</Title></Header>
        <Form onSubmit={handleSubmit} $visible={visible}>
          <Input type="text" placeholder="Euer Name" value={name} onChange={e => setName(e.target.value)} required />
          <TextArea placeholder="Eure Nachricht an uns..." value={message} onChange={e => setMessage(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? 'Wird gesendet...' : 'Eintragen'}</Button>
        </Form>
        <EntriesList>
          {entries.map((entry, i) => (
            <Entry key={entry.id || i} $visible={visible} $index={i}>
              <EntryName>{entry.name}</EntryName>
              <EntryMessage>"{entry.message}"</EntryMessage>
              <EntryDate>{new Date(entry.created_at).toLocaleDateString('de-DE')}</EntryDate>
            </Entry>
          ))}
        </EntriesList>
      </Container>
    </Section>
  );
}

export default Guestbook;
