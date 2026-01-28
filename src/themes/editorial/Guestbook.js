import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGuestbook } from '../../components/shared/GuestbookCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

// ============================================
// ANIMATIONS
// ============================================

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const lineGrow = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

const Section = styled.section`
  padding: var(--section-padding) 0;
  background: var(--editorial-white);
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 5rem);
`;

const Eyebrow = styled.span`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--editorial-red);
  margin-bottom: 1.5rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
  `}
`;

const Title = styled.h2`
  font-family: var(--font-headline);
  font-size: clamp(3rem, 12vw, 7rem);
  font-weight: 700;
  color: var(--editorial-black);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.15s;
  `}
`;

const Description = styled.p`
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.15rem);
  font-style: italic;
  color: var(--editorial-gray);
  margin-top: 1.5rem;
  line-height: 1.7;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.3s;
  `}
`;

const FormSection = styled.div`
  background: var(--editorial-light-gray);
  padding: clamp(2rem, 5vw, 3rem);
  margin-bottom: 4rem;
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.4s;
  `}
`;

const FormTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-headline);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: var(--editorial-white);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: var(--editorial-white);
  border: 2px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--editorial-black);
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--editorial-red);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: var(--editorial-black);
  color: var(--editorial-white);
  border: none;
  font-family: var(--font-headline);
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  
  &:hover:not(:disabled) {
    background: var(--editorial-red);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EntriesSection = styled.div`
  opacity: 0;
  
  ${p => p.$visible && css`
    animation: ${fadeInUp} 0.8s ease forwards;
    animation-delay: 0.5s;
  `}
`;

const EntriesTitle = styled.h3`
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
  margin-bottom: 0.5rem;
`;

const EntriesCount = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-gray);
`;

const Divider = styled.div`
  width: 60px;
  height: 3px;
  background: var(--editorial-red);
  margin: 1.5rem 0 2rem;
  transform: scaleX(0);
  transform-origin: left;
  
  ${p => p.$visible && css`
    animation: ${lineGrow} 0.6s ease forwards;
    animation-delay: 0.6s;
  `}
`;

const EntriesGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const EntryCard = styled.article`
  padding: 2rem;
  background: var(--editorial-light-gray);
  border-left: 4px solid var(--editorial-red);
`;

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const EntryName = styled.h4`
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--editorial-black);
`;

const EntryDate = styled.span`
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--editorial-gray);
`;

const EntryMessage = styled.p`
  font-family: var(--font-serif);
  font-size: 1.05rem;
  color: var(--editorial-gray);
  line-height: 1.8;
  margin: 0;
`;

const EntryImage = styled.img`
  max-width: 200px;
  margin-top: 1rem;
  filter: grayscale(30%);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: var(--editorial-light-gray);
`;

const EmptyIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--editorial-gray);
`;

// ============================================
// COMPONENT
// ============================================

function Guestbook() {
  const { content } = useWedding();
  const guestbookData = content?.guestbook || {};
  
  const title = guestbookData.title || 'Gästebuch';
  const description = guestbookData.description || 'Hinterlasst uns einen lieben Gruß!';
  
  const {
    entries,
    formData,
    submitting,
    error,
    success,
    updateField,
    submitEntry,
  } = useGuestbook();
  
  const [visible, setVisible] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'success', message: '' });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (success) {
      setModalState({
        isOpen: true,
        type: 'success',
        message: 'Danke für deinen Eintrag! Er wird nach Freigabe angezeigt.',
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setModalState({
        isOpen: true,
        type: 'error',
        message: error,
      });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitEntry();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const approvedEntries = entries.filter(e => e.approved);

  return (
    <Section id="guestbook" ref={sectionRef}>
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Eure Worte</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Description $visible={visible}>{description}</Description>
        </Header>
        
        <FormSection $visible={visible}>
          <FormTitle>Eintrag schreiben</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Dein Name"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>E-Mail (optional)</Label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Für Rückfragen"
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>Nachricht *</Label>
                <TextArea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  placeholder="Deine Glückwünsche oder ein lieber Gruß..."
                  required
                />
              </FormGroup>
            </FormGrid>
            
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Wird gesendet...' : 'Eintrag absenden'}
            </SubmitButton>
          </form>
        </FormSection>
        
        <EntriesSection $visible={visible}>
          <EntriesTitle>Einträge</EntriesTitle>
          <EntriesCount>{approvedEntries.length} Einträge</EntriesCount>
          <Divider $visible={visible} />
          
          {approvedEntries.length > 0 ? (
            <EntriesGrid>
              {approvedEntries.map(entry => (
                <EntryCard key={entry.id}>
                  <EntryHeader>
                    <EntryName>{entry.name}</EntryName>
                    <EntryDate>{formatDate(entry.created_at)}</EntryDate>
                  </EntryHeader>
                  <EntryMessage>{entry.message}</EntryMessage>
                  {entry.image_url && (
                    <EntryImage src={entry.image_url} alt="" />
                  )}
                </EntryCard>
              ))}
            </EntriesGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyText>Noch keine Einträge – sei der Erste!</EmptyText>
            </EmptyState>
          )}
        </EntriesSection>
      </Container>
      
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        autoClose={modalState.type === 'success' ? 3000 : 0}
      />
    </Section>
  );
}

export default Guestbook;
