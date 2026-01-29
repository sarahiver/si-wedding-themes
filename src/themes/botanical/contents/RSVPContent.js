// RSVPContent
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';
import { useRSVP } from '../../../components/shared/RSVPCore';

const Wrapper = styled.div``;
const Eyebrow = styled.p`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--light); margin-bottom: 0.5rem; text-align: center;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: 1.8rem; font-weight: 300; color: var(--black); margin-bottom: 1rem; text-align: center;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 0.6rem;`;
const Input = styled.input`padding: 0.7rem; font-size: 0.9rem; border: 1px solid var(--pale); &:focus { outline: none; border-color: var(--dark); }`;
const Select = styled.select`padding: 0.7rem; font-size: 0.9rem; border: 1px solid var(--pale);`;
const Row = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;`;
const Btn = styled.button`padding: 0.6rem; font-size: 0.8rem; font-weight: 600; background: ${p => p.$sel ? 'var(--black)' : 'var(--white)'}; color: ${p => p.$sel ? 'var(--white)' : 'var(--medium)'}; border: 1px solid ${p => p.$sel ? 'var(--black)' : 'var(--pale)'};`;
const TextArea = styled.textarea`padding: 0.7rem; font-size: 0.9rem; border: 1px solid var(--pale); min-height: 60px; resize: none;`;
const Submit = styled.button`padding: 0.8rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--black); color: var(--white); &:disabled { opacity: 0.4; }`;
const Success = styled.div`text-align: center; padding: 2rem 0; h3 { font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 0.5rem; } p { color: var(--medium); }`;

function RSVPContent() {
  const { content } = useWedding();
  const title = content?.rsvp?.title || 'Zusagen';
  const { formData, submitting, submitted, updateField, submit } = useRSVP();
  const canSubmit = formData.name && formData.email && formData.attending !== null;

  if (submitted) {
    return <Wrapper><Success><h3>{formData.attending ? 'Wunderbar!' : 'Schade!'}</h3><p>{formData.attending ? 'Wir freuen uns auf euch.' : 'Danke für die Rückmeldung.'}</p></Success></Wrapper>;
  }

  return (
    <Wrapper>
      <Eyebrow>Seid ihr dabei?</Eyebrow>
      <Title>{title}</Title>
      <Form onSubmit={e => { e.preventDefault(); submit(); }}>
        <Input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="Name" />
        <Input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="E-Mail" />
        <Row>
          <Btn type="button" $sel={formData.attending === true} onClick={() => updateField('attending', true)}>Ja, gerne</Btn>
          <Btn type="button" $sel={formData.attending === false} onClick={() => updateField('attending', false)}>Leider nicht</Btn>
        </Row>
        {formData.attending && <Select value={formData.persons} onChange={e => updateField('persons', parseInt(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Person{n > 1 ? 'en' : ''}</option>)}</Select>}
        <TextArea value={formData.message} onChange={e => updateField('message', e.target.value)} placeholder="Nachricht (optional)" />
        <Submit type="submit" disabled={!canSubmit || submitting}>{submitting ? 'Senden...' : 'Absenden'}</Submit>
      </Form>
    </Wrapper>
  );
}

export default RSVPContent;
