import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { submitGuestbookEntry, getGuestbookEntries } from '../../lib/supabase';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;

const Section = styled.section`padding: var(--section-padding) 2rem; background: var(--botanical-paper);`;
const Container = styled.div`max-width: 700px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 2.5rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--botanical-olive); margin-bottom: 0.5rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-handwritten); font-size: clamp(2.5rem, 7vw, 4.5rem); color: var(--botanical-forest); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.1s;`;

const Form = styled.form`background: white; border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(107, 127, 94, 0.1); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: 0.2s;`;
const Input = styled.input`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-charcoal); background: var(--botanical-cream); border: 2px solid var(--botanical-mint); border-radius: 12px; margin-bottom: 1rem; &:focus { outline: none; border-color: var(--botanical-sage); }`;
const TextArea = styled.textarea`width: 100%; padding: 0.875rem 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--botanical-charcoal); background: var(--botanical-cream); border: 2px solid var(--botanical-mint); border-radius: 12px; min-height: 100px; margin-bottom: 1rem; resize: vertical; &:focus { outline: none; border-color: var(--botanical-sage); }`;
const Button = styled.button`padding: 0.875rem 2rem; font-family: var(--font-handwritten); font-size: 1.1rem; color: white; background: linear-gradient(135deg, var(--botanical-sage), var(--botanical-olive)); border: none; border-radius: 50px; cursor: pointer; &:hover { transform: translateY(-2px); } &:disabled { background: var(--botanical-gray); }`;

const EntriesList = styled.div`display: flex; flex-direction: column; gap: 1rem;`;
const Entry = styled.div`background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 10px rgba(107, 127, 94, 0.08); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'}; animation-delay: ${p => 0.3 + p.$index * 0.1}s;`;
const EntryHeader = styled.div`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;`;
const EntryName = styled.span`font-family: var(--font-handwritten); font-size: 1.25rem; color: var(--botanical-forest);`;
const EntryDateText = styled.span`font-family: var(--font-body); font-size: 0.7rem; color: var(--botanical-gray);`;
const EntryMessage = styled.p`font-family: var(--font-body); font-size: 0.95rem; line-height: 1.7; color: var(--botanical-brown); font-style: italic;`;

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
    <Section ref={sectionRef} id="guestbook">
      <Container>
        <Header><Eyebrow $visible={visible}>📝 Eure Worte</Eyebrow><Title $visible={visible}>{title}</Title></Header>
        <Form onSubmit={handleSubmit} $visible={visible}>
          <Input type="text" placeholder="Euer Name 🌿" value={name} onChange={e => setName(e.target.value)} required />
          <TextArea placeholder="Eure Nachricht an uns... 💕" value={message} onChange={e => setMessage(e.target.value)} required />
          <Button type="submit" disabled={loading}>{loading ? '🌱 Wird gespeichert...' : '🌸 Eintragen'}</Button>
        </Form>
        <EntriesList>
          {entries.map((entry, i) => (
            <Entry key={entry.id || i} $visible={visible} $index={i}>
              <EntryHeader><EntryName>🌿 {entry.name}</EntryName><EntryDateText>{new Date(entry.created_at).toLocaleDateString('de-DE')}</EntryDateText></EntryHeader>
              <EntryMessage>"{entry.message}"</EntryMessage>
            </Entry>
          ))}
        </EntriesList>
      </Container>
    </Section>
  );
}

export default Guestbook;
