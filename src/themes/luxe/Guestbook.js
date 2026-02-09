import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-anthracite);`;
const Container = styled.div`max-width: var(--container-narrow); margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;

const Form = styled.form`margin-bottom: 4rem; padding: 2rem; background: var(--luxe-charcoal); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--luxe-cream); background: var(--luxe-anthracite); border: 1px solid var(--luxe-graphite); margin-bottom: 1rem; &:focus { outline: none; border-color: var(--luxe-gold); }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--luxe-cream); background: var(--luxe-anthracite); border: 1px solid var(--luxe-graphite); min-height: 100px; margin-bottom: 1rem; resize: vertical; &:focus { outline: none; border-color: var(--luxe-gold); }`;
const Button = styled.button`padding: 1rem 2rem; font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-void); background: var(--luxe-gold); &:hover { background: var(--luxe-champagne); } &:disabled { background: var(--luxe-graphite); }`;

const EntriesList = styled.div`display: flex; flex-direction: column; gap: 2rem;`;
const Entry = styled.div`padding-bottom: 2rem; border-bottom: 1px solid var(--luxe-charcoal); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: ${p => 0.3 + p.$index * 0.1}s; &:last-child { border-bottom: none; }`;
const EntryName = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.5rem;`;
const EntryMessage = styled.p`font-family: var(--font-body); font-size: 0.9rem; line-height: 1.8; color: var(--luxe-pearl); font-style: italic;`;
const EntryDateText = styled.span`font-family: var(--font-body); font-size: 0.65rem; color: var(--luxe-slate); display: block; margin-top: 0.75rem;`;

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
    if (project?.id) getGuestbookEntries(project.id).then(result => setEntries(Array.isArray(result?.data) ? result.data : []));
  }, [project?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project?.id || !name || !message) return;
    setLoading(true);
    try {
      await submitGuestbookEntry(project.id, { name, message });
      setName(''); setMessage('');
      const result = await getGuestbookEntries(project.id);
      setEntries(Array.isArray(result?.data) ? result.data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <Section ref={sectionRef} id="guestbook">
      <Container>
        <Header><Eyebrow $visible={visible}>Eure Worte</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Form onSubmit={handleSubmit} $visible={visible}>
          <Input type="text" placeholder="Euer Name" value={name} onChange={e => setName(e.target.value)} required />
          <TextArea placeholder="Eure Nachricht..." value={message} onChange={e => setMessage(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? 'Wird gesendet...' : 'Eintragen'}</Button>
        </Form>
        <EntriesList>
          {entries.map((entry, i) => (
            <Entry key={entry.id || i} $visible={visible} $index={i}>
              <EntryName>{entry.name}</EntryName>
              <EntryMessage>"{entry.message}"</EntryMessage>
              <EntryDateText>{new Date(entry.created_at).toLocaleDateString('de-DE')}</EntryDateText>
            </Entry>
          ))}
        </EntriesList>
      </Container>
    </Section>
  );
}

export default Guestbook;
