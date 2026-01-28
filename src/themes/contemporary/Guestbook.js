import { useWedding } from '../../context/WeddingContext';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--gray-100);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--coral);
  padding: 0.5rem 1.5rem;
  border: 2px solid var(--coral);
  margin-bottom: 1.5rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: all 0.6s ease;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.1s;
`;

const FormCard = styled.form`
  background: var(--white);
  padding: 2.5rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-lg);
  margin-bottom: 3rem;
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateY(${p => p.$visible ? 0 : '30px'});
  transition: all 0.6s ease 0.2s;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gray-600);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: var(--black);
  background: var(--gray-100);
  border: 3px solid var(--black);
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    background: var(--white);
    box-shadow: var(--shadow-sm);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--white);
  background: var(--coral);
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0 var(--black);
  }
`;

const SuccessMsg = styled.div`
  background: var(--electric);
  color: var(--black);
  padding: 1rem;
  text-align: center;
  font-weight: 700;
  margin-bottom: 1rem;
  border: 2px solid var(--black);
`;

const EntriesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const colors = ['var(--coral)', 'var(--electric)', 'var(--yellow)', 'var(--purple)'];

const EntryCard = styled.div`
  background: var(--white);
  padding: 2rem;
  border: 3px solid var(--black);
  box-shadow: var(--shadow-md);
  border-left: 8px solid ${p => p.$color};
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? 0 : '-20px'});
  transition: all 0.5s ease ${p => 0.3 + p.$index * 0.1}s;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.75rem;
`;

const EntryName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
`;

const EntryDate = styled.span`
  font-size: 0.75rem;
  color: var(--gray-500);
`;

const EntryMessage = styled.p`
  font-size: 0.95rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin: 0;
`;

function Guestbook() {
  const { content, projectId, slug } = useWedding();
  const guestbookData = content?.guestbook || {};

  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const sectionRef = useRef(null);

  const defaultEntries = [
    { name: 'Familie Weber', message: 'Wir freuen uns riesig auf euren großen Tag! Alles Liebe für eure gemeinsame Zukunft.', date: 'vor 2 Tagen' },
    { name: 'Anna & Markus', message: 'Ihr seid das perfekte Paar! Können es kaum erwarten, mit euch zu feiern.', date: 'vor 5 Tagen' },
  ];

  const displayEntries = entries.length > 0 ? entries : defaultEntries;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) await onSubmit(formData);
    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Section ref={sectionRef} id="guestbook">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>📝 Gästebuch</Eyebrow>
          <Title $visible={visible}>Leave a Note</Title>
        </Header>
        
        <FormCard $visible={visible} onSubmit={handleSubmit}>
          {success && <SuccessMsg>✓ Danke für deinen Eintrag!</SuccessMsg>}
          <FormRow>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </FormGroup>
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>Nachricht</Label>
            <Textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
          </FormGroup>
          <SubmitButton type="submit">Eintrag absenden →</SubmitButton>
        </FormCard>
        
        <EntriesGrid>
          {displayEntries.map((entry, i) => (
            <EntryCard key={i} $index={i} $visible={visible} $color={colors[i % colors.length]}>
              <EntryHeader>
                <EntryName>{entry.name}</EntryName>
                <EntryDate>{entry.date}</EntryDate>
              </EntryHeader>
              <EntryMessage>{entry.message}</EntryMessage>
            </EntryCard>
          ))}
        </EntriesGrid>
      </Container>
    </Section>
  );
}

export default Guestbook;
