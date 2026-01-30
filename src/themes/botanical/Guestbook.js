import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const Section = styled.section`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--zen-bg-alt);
  padding: var(--section-padding) 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 300;
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--zen-text);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.1s;
  &.visible { opacity: 1; transform: translateY(0); }
`;

const Input = styled.input`
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--zen-text);
  background: var(--zen-bg);
  border: 1px solid var(--zen-line);
  outline: none;
  &:focus { border-color: var(--zen-text); }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--zen-text);
  background: var(--zen-bg);
  border: 1px solid var(--zen-line);
  outline: none;
  resize: none;
  min-height: 100px;
  &:focus { border-color: var(--zen-text); }
`;

const Submit = styled.button`
  padding: 1rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--zen-bg);
  background: var(--zen-text);
  border: none;
  cursor: pointer;
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.4; }
`;

const Entries = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Entry = styled.div`
  padding: 1.5rem;
  background: var(--zen-bg);
  border: 1px solid var(--zen-line);
`;

const EntryName = styled.p`
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--zen-text);
  margin-bottom: 0.5rem;
`;

const EntryMessage = styled.p`
  font-size: 0.9rem;
  color: var(--zen-text-light);
  line-height: 1.6;
  margin: 0;
`;

const EntryDate = styled.p`
  font-size: 0.7rem;
  color: var(--zen-text-muted);
  margin-top: 0.75rem;
`;

function Guestbook() {
  const { content, weddingId } = useWedding();
  const data = content?.guestbook || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const title = data.title || 'Gästebuch';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Load entries
  useEffect(() => {
    if (data.entries) setEntries(data.entries);
  }, [data.entries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    setSubmitting(true);
    // Add entry locally for demo
    setEntries(prev => [{
      name: formData.name,
      message: formData.message,
      created_at: new Date().toISOString()
    }, ...prev]);
    setFormData({ name: '', message: '' });
    setSubmitting(false);
  };

  return (
    <Section id="guestbook" ref={sectionRef}>
      <Content>
        <Title className={visible ? 'visible' : ''}>{title}</Title>
        
        <Form className={visible ? 'visible' : ''} onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Name" 
            value={formData.name} 
            onChange={e => setFormData(p => ({...p, name: e.target.value}))} 
          />
          <TextArea 
            placeholder="Nachricht" 
            value={formData.message} 
            onChange={e => setFormData(p => ({...p, message: e.target.value}))} 
          />
          <Submit type="submit" disabled={!formData.name || !formData.message || submitting}>
            {submitting ? 'Senden...' : 'Eintragen'}
          </Submit>
        </Form>
        
        {entries.length > 0 && (
          <Entries>
            {entries.map((entry, i) => (
              <Entry key={i}>
                <EntryName>{entry.name}</EntryName>
                <EntryMessage>{entry.message}</EntryMessage>
                {entry.created_at && (
                  <EntryDate>{new Date(entry.created_at).toLocaleDateString('de-DE')}</EntryDate>
                )}
              </Entry>
            ))}
          </Entries>
        )}
      </Content>
    </Section>
  );
}

export default Guestbook;
