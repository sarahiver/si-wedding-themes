import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const Section = styled.section`
  padding: 8rem 2rem;
  background: var(--cream);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 400;
  color: var(--forest);
`;

const Description = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  color: var(--text-light);
  margin-top: 1rem;
  line-height: 1.7;
`;

const Form = styled.form`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid var(--sage-light);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Lato', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  padding: 1rem;
  background: var(--cream);
  border: 1px solid var(--sage-light);
  border-radius: 10px;
  color: var(--forest);
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-muted);
  }
`;

const Button = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) { 
    background: var(--sage-dark);
    transform: translateY(-2px);
  }
  &:disabled { 
    opacity: 0.6; 
    cursor: not-allowed; 
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-family: 'Lato', sans-serif;
  font-size: 0.85rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(192, 57, 43, 0.1);
  border-radius: 6px;
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EntryCard = styled.div`
  background: var(--cream-light);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid var(--sage-light);
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EntryName = styled.div`
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--forest);
`;

const EntryDate = styled.div`
  font-family: 'Lato', sans-serif;
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const EntryMessage = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  
  .icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
  p { font-family: 'Lato', sans-serif; }
`;

function Guestbook({ content = {} }) {
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  
  const {
    entries,
    loading,
    submitting,
    error,
    success,
    formData,
    updateField,
    submitEntry,
  } = useGuestbook();

  const title = content.title || 'Gästebuch';
  const description = content.description || 'Hinterlasst uns eine liebe Nachricht, einen Wunsch oder einen guten Rat für unsere gemeinsame Zukunft.';

  // Show modal on success
  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Danke für euren Eintrag! Er wird nach Freigabe sichtbar.',
      });
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitEntry();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Section id="guestbook">
      <Container>
        <Header>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Euer Name</Label>
            <Input 
              type="text"
              placeholder="Wie heißt ihr?"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              required 
            />
          </FormGroup>
          <FormGroup>
            <Label>Eure Nachricht</Label>
            <Textarea 
              placeholder="Eure Wünsche, Gedanken oder Ratschläge..."
              value={formData.message}
              onChange={e => updateField('message', e.target.value)}
              required 
            />
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Wird gesendet...' : 'Eintragen'}
          </Button>
        </Form>
        
        {loading ? (
          <EmptyState>
            <p>Einträge werden geladen...</p>
          </EmptyState>
        ) : entries.length === 0 ? (
          <EmptyState>
            <div className="icon">📖</div>
            <p>Seid die Ersten, die etwas schreiben!</p>
          </EmptyState>
        ) : (
          <EntriesList>
            {entries.map(entry => (
              <EntryCard key={entry.id}>
                <EntryHeader>
                  <EntryName>{entry.name}</EntryName>
                  <EntryDate>{formatDate(entry.created_at)}</EntryDate>
                </EntryHeader>
                <EntryMessage>{entry.message}</EntryMessage>
              </EntryCard>
            ))}
          </EntriesList>
        )}
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={3000}
      />
    </Section>
  );
}

export default Guestbook;
