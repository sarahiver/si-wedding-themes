import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const lineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;
const checkIn = keyframes`from { transform: scale(0); } to { transform: scale(1); }`;

const Section = styled.section`
  padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem);
  background: var(--classic-charcoal);
  color: #FFFFFF;
`;
const Container = styled.div`max-width: 650px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; color: #FFFFFF; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.9rem; font-weight: 300; color: rgba(255,255,255,0.6); margin-top: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.25s;`}`;
const Line = styled.div`width: 60px; height: 1px; background: var(--classic-gold); margin: 1.5rem auto 0; transform: scaleX(0); ${p => p.$v && css`animation: ${lineGrow} 0.6s ease forwards; animation-delay: 0.35s;`}`;

const Form = styled.form`opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.4s;`}`;
const FormGroup = styled.div`margin-bottom: 1.5rem;`;
const Label = styled.label`display: block; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-size: 0.9rem; font-weight: 300; transition: border 0.3s; &:focus { outline: none; border-color: var(--classic-gold); } &::placeholder { color: rgba(255,255,255,0.3); }`;
const Textarea = styled.textarea`width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-size: 0.9rem; font-weight: 300; min-height: 100px; resize: vertical; transition: border 0.3s; &:focus { outline: none; border-color: var(--classic-gold); } &::placeholder { color: rgba(255,255,255,0.3); }`;
const Select = styled.select`width: 100%; padding: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF; font-size: 0.9rem; option { background: var(--classic-charcoal); }`;

const RadioGroup = styled.div`display: flex; gap: 1rem; flex-wrap: wrap;`;
const RadioLabel = styled.label`
  display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
  padding: 0.75rem 1.25rem; border: 1px solid ${p => p.$active ? 'var(--classic-gold)' : 'rgba(255,255,255,0.15)'};
  background: ${p => p.$active ? 'rgba(196,168,124,0.1)' : 'transparent'};
  transition: all 0.3s; font-size: 0.85rem; font-weight: 300;
  &:hover { border-color: var(--classic-gold); }
  input { display: none; }
`;

const SubmitBtn = styled.button`
  width: 100%; padding: 1.25rem; background: var(--classic-gold); border: none;
  color: var(--classic-white); font-size: 0.7rem; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase; transition: all 0.3s;
  &:hover { background: var(--classic-gold-dark); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const SuccessBox = styled.div`text-align: center; padding: 3rem 0; animation: ${fadeInUp} 0.8s ease;`;
const SuccessIcon = styled.div`width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--classic-gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; animation: ${checkIn} 0.5s ease; font-size: 1.5rem;`;
const ErrorMsg = styled.p`color: #E57373; font-size: 0.8rem; margin-top: 0.5rem;`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  const { formData, submitting, submitted, error, updateField, submit } = useRSVP();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const title = rsvpData.title || 'RSVP';
  const description = rsvpData.description || 'Bitte gebt uns bis zum Stichtag Bescheid, ob ihr dabei seid.';

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e) => { e.preventDefault(); await submit(); };

  if (submitted) {
    return (
      <Section id="rsvp">
        <Container>
          <SuccessBox>
            <SuccessIcon>✓</SuccessIcon>
            <Title $v={true} style={{opacity:1}}>Vielen Dank!</Title>
            <Desc $v={true} style={{opacity:1}}>
              {formData.attending === 'yes' ? 'Wir freuen uns auf euch!' : 'Schade! Wir werden euch vermissen.'}
            </Desc>
          </SuccessBox>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="rsvp" ref={ref}>
      <Container>
        <Header>
          <Eyebrow $v={visible}>Zusage</Eyebrow>
          <Title $v={visible}>{title}</Title>
          <Desc $v={visible}>{description}</Desc>
          <Line $v={visible} />
        </Header>
        <Form $v={visible} onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Kommt ihr?</Label>
            <RadioGroup>
              <RadioLabel $active={formData.attending === 'yes'}>
                <input type="radio" name="attending" value="yes" checked={formData.attending === 'yes'} onChange={() => updateField('attending', 'yes')} /> Ja, wir sind dabei!
              </RadioLabel>
              <RadioLabel $active={formData.attending === 'no'}>
                <input type="radio" name="attending" value="no" checked={formData.attending === 'no'} onChange={() => updateField('attending', 'no')} /> Leider nicht
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          <FormGroup><Label>Name</Label><Input placeholder="Euer Name" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} required /></FormGroup>
          <FormGroup><Label>E-Mail</Label><Input type="email" placeholder="email@beispiel.de" value={formData.email || ''} onChange={e => updateField('email', e.target.value)} required /></FormGroup>
          {formData.attending === 'yes' && (
            <FormGroup><Label>Anzahl Personen</Label><Select value={formData.guests || '1'} onChange={e => updateField('guests', e.target.value)}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>)}
            </Select></FormGroup>
          )}
          <FormGroup><Label>Nachricht (optional)</Label><Textarea placeholder="Allergien, Sonderwünsche..." value={formData.message || ''} onChange={e => updateField('message', e.target.value)} /></FormGroup>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitBtn type="submit" disabled={submitting}>{submitting ? 'Wird gesendet...' : 'Absenden'}</SubmitBtn>
        </Form>
      </Container>
    </Section>
  );
}

export default RSVP;
