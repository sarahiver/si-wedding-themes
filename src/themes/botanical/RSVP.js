// Botanical Tree RSVP
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';
import { useRSVP } from '../../components/shared/RSVPCore';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--pale);
  background: var(--white);
  &:focus { outline: none; border-color: var(--dark); }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--pale);
  background: var(--white);
  cursor: pointer;
`;

const AttendanceRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const AttendanceBtn = styled.button`
  padding: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 600;
  background: ${p => p.$selected ? 'var(--black)' : 'var(--white)'};
  color: ${p => p.$selected ? 'var(--white)' : 'var(--medium)'};
  border: 1px solid ${p => p.$selected ? 'var(--black)' : 'var(--pale)'};
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid var(--pale);
  background: var(--white);
  min-height: 80px;
  resize: none;
`;

const SubmitBtn = styled.button`
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--black);
  color: var(--white);
  cursor: pointer;
  &:disabled { opacity: 0.4; }
`;

const SuccessMsg = styled.div`
  text-align: center;
  padding: 2rem 0;
  h3 { font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem; }
  p { color: var(--medium); }
`;

function RSVP({ side = 'right' }) {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  const title = rsvpData.title || 'Zusagen';
  
  const { formData, submitting, submitted, updateField, submit } = useRSVP();
  const canSubmit = formData.name && formData.email && formData.attending !== null;

  if (submitted) {
    return (
      <ContentBranch side={side} eyebrow="Danke!" title={formData.attending ? 'Wunderbar!' : 'Schade!'}>
        <SuccessMsg>
          <p>{formData.attending ? 'Wir freuen uns auf euch.' : 'Danke für die Rückmeldung.'}</p>
        </SuccessMsg>
      </ContentBranch>
    );
  }

  return (
    <ContentBranch side={side} eyebrow="Seid ihr dabei?" title={title}>
      <Form onSubmit={e => { e.preventDefault(); submit(); }}>
        <Input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="Name" />
        <Input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="E-Mail" />
        <AttendanceRow>
          <AttendanceBtn type="button" $selected={formData.attending === true} onClick={() => updateField('attending', true)}>Ja, gerne</AttendanceBtn>
          <AttendanceBtn type="button" $selected={formData.attending === false} onClick={() => updateField('attending', false)}>Leider nicht</AttendanceBtn>
        </AttendanceRow>
        {formData.attending && (
          <Select value={formData.persons} onChange={e => updateField('persons', parseInt(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Person{n > 1 ? 'en' : ''}</option>)}
          </Select>
        )}
        <TextArea value={formData.message} onChange={e => updateField('message', e.target.value)} placeholder="Nachricht (optional)" />
        <SubmitBtn type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Senden...' : 'Absenden'}</SubmitBtn>
      </Form>
    </ContentBranch>
  );
}

export default RSVP;
