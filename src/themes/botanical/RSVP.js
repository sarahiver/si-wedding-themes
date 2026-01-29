// Botanical RSVP - Form in hole
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useKnotholes } from './KnotholeOverlay';
import { useRSVP } from '../../components/shared/RSVPCore';

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
  text-align: center;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 2px; }
  &::-webkit-scrollbar-thumb { background: var(--pale); }
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.4rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 1rem;
`;

const Form = styled.form`
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 0.8rem;
  font-size: 0.85rem;
  border: 1px solid var(--pale);
  background: var(--white);
  
  &:focus {
    outline: none;
    border-color: var(--dark);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.7rem 0.8rem;
  font-size: 0.85rem;
  border: 1px solid var(--pale);
  background: var(--white);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--dark);
  }
`;

const AttendanceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const AttendanceBtn = styled.button`
  padding: 0.6rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p => p.$selected ? 'var(--black)' : 'var(--white)'};
  color: ${p => p.$selected ? 'var(--white)' : 'var(--medium)'};
  border: 1px solid ${p => p.$selected ? 'var(--black)' : 'var(--pale)'};
  cursor: pointer;
  transition: all 0.2s;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.7rem 0.8rem;
  font-size: 0.85rem;
  border: 1px solid var(--pale);
  background: var(--white);
  min-height: 60px;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: var(--dark);
  }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.8rem;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--black);
  color: var(--white);
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
  
  &:hover:not(:disabled) { opacity: 0.8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const SuccessMsg = styled.div`
  text-align: center;
  padding: 2rem 1rem;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: var(--black);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 0.9rem;
  color: var(--medium);
`;

function RSVP() {
  const { content } = useWedding();
  const { mainHole } = useKnotholes();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'Zusagen';
  
  const {
    formData,
    submitting,
    submitted,
    error,
    updateField,
    submit,
  } = useRSVP();

  const canSubmit = formData.name && formData.email && formData.attending !== null;

  if (submitted) {
    return (
      <Section data-section="rsvp">
        <HoleContent $hole={mainHole}>
          <SuccessMsg>
            <SuccessTitle>{formData.attending ? 'Wunderbar!' : 'Schade!'}</SuccessTitle>
            <SuccessText>
              {formData.attending ? 'Wir freuen uns auf euch.' : 'Danke für die Rückmeldung.'}
            </SuccessText>
          </SuccessMsg>
        </HoleContent>
      </Section>
    );
  }

  return (
    <Section data-section="rsvp">
      <HoleContent $hole={mainHole}>
        <Eyebrow>Seid ihr dabei?</Eyebrow>
        <Title>{title}</Title>
        
        <Form onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <Input
            type="text"
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            placeholder="Name"
          />
          
          <Input
            type="email"
            value={formData.email}
            onChange={e => updateField('email', e.target.value)}
            placeholder="E-Mail"
          />
          
          <AttendanceRow>
            <AttendanceBtn
              type="button"
              $selected={formData.attending === true}
              onClick={() => updateField('attending', true)}
            >
              Ja, gerne
            </AttendanceBtn>
            <AttendanceBtn
              type="button"
              $selected={formData.attending === false}
              onClick={() => updateField('attending', false)}
            >
              Leider nicht
            </AttendanceBtn>
          </AttendanceRow>
          
          {formData.attending && (
            <Select
              value={formData.persons}
              onChange={e => updateField('persons', parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n} Person{n > 1 ? 'en' : ''}</option>
              ))}
            </Select>
          )}
          
          <TextArea
            value={formData.message}
            onChange={e => updateField('message', e.target.value)}
            placeholder="Nachricht (optional)"
          />
          
          <SubmitBtn type="submit" disabled={!canSubmit || submitting}>
            {submitting ? 'Senden...' : 'Absenden'}
          </SubmitBtn>
          
          {error && <p style={{ color: '#c00', fontSize: '0.75rem' }}>{error}</p>}
        </Form>
      </HoleContent>
    </Section>
  );
}

export default RSVP;
