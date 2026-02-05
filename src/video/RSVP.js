// Video RSVP - Cinematic form with per-person dietary/allergies
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import SectionWrapper from './SectionWrapper';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Content = styled.div`text-align: center; max-width: 550px; width: 100%;`;
const Eyebrow = styled.p`font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.3em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Form = styled.form`display: flex; flex-direction: column; gap: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s; text-align: left;`;
const FormGroup = styled.div`margin-bottom: 0.5rem;`;
const Label = styled.label`display: block; font-family: var(--font-primary); font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: var(--video-silver); margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-white); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); &:focus { outline: none; border-color: var(--video-accent); } &::placeholder { color: var(--video-gray); }`;
const Select = styled.select`width: 100%; padding: 1rem; font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-white); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); cursor: pointer; &:focus { outline: none; border-color: var(--video-accent); } option { background: var(--video-charcoal); }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: var(--font-primary); font-size: 0.9rem; color: var(--video-white); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); min-height: 80px; resize: vertical; &:focus { outline: none; border-color: var(--video-accent); } &::placeholder { color: var(--video-gray); }`;
const RadioGroup = styled.div`display: flex; gap: 1rem;`;
const RadioLabel = styled.label`flex: 1; display: flex; align-items: center; justify-content: center; padding: 1rem; font-family: var(--font-primary); font-size: 0.8rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em; color: ${p => p.$checked ? 'var(--video-white)' : 'var(--video-gray)'}; background: ${p => p.$checked ? 'var(--video-accent)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${p => p.$checked ? 'var(--video-accent)' : 'rgba(255,255,255,0.15)'}; cursor: pointer; transition: all 0.3s ease; input { display: none; } &:hover { border-color: var(--video-accent); }`;
const SubmitBtn = styled.button`padding: 1rem; font-family: var(--font-primary); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--video-white); background: var(--video-accent); border: none; cursor: pointer; transition: all 0.3s ease; &:hover { background: var(--video-accent-light); } &:disabled { background: var(--video-gray); cursor: not-allowed; }`;

const GuestSection = styled.div`margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);`;
const GuestSectionTitle = styled.h4`font-family: var(--font-primary); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--video-accent); margin-bottom: 1rem;`;
const GuestCard = styled.div`background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); padding: 1rem; margin-bottom: 0.75rem;`;
const GuestNumber = styled.span`display: block; font-family: var(--font-primary); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--video-silver); margin-bottom: 0.75rem;`;
const GuestFields = styled.div`display: grid; gap: 0.5rem;`;

const ErrorMessage = styled.p`background: rgba(196, 30, 58, 0.2); border: 1px solid rgba(196, 30, 58, 0.4); padding: 0.75rem 1rem; font-family: var(--font-primary); font-size: 0.85rem; color: #ff6b6b; margin-bottom: 1rem;`;

const SuccessState = styled.div`text-align: center; padding: 4rem 2rem; opacity: 0; animation: ${fadeUp} 0.8s var(--ease-out-expo) forwards;`;
const SuccessIcon = styled.div`width: 70px; height: 70px; margin: 0 auto 1.5rem; border: 2px solid var(--video-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--video-accent);`;
const SuccessTitle = styled.h3`font-family: var(--font-display); font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--video-white); margin-bottom: 0.75rem;`;
const SuccessText = styled.p`font-family: var(--font-primary); font-size: 0.95rem; color: var(--video-silver); line-height: 1.7;`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  const title = rsvpData.title || 'Zusagen';
  const askDietary = rsvpData.ask_dietary !== false;
  const askAllergies = rsvpData.ask_allergies !== false;
  const customQuestion = rsvpData.custom_question || '';

  const {
    formData,
    updateField,
    submitting,
    error,
    submitted,
    submit,
  } = useRSVP();

  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submit();
  };

  const handlePersonsChange = (newCount) => {
    updateField('persons', newCount);
    const currentGuests = formData.guests || [];
    if (newCount > currentGuests.length) {
      const newGuests = [...currentGuests];
      for (let i = currentGuests.length; i < newCount; i++) {
        newGuests.push({ name: '', dietary: '', allergies: '' });
      }
      updateField('guests', newGuests);
    } else {
      updateField('guests', currentGuests.slice(0, newCount));
    }
  };

  const updateGuest = (index, field, value) => {
    const newGuests = [...(formData.guests || [])];
    if (!newGuests[index]) newGuests[index] = { name: '', dietary: '', allergies: '' };
    newGuests[index] = { ...newGuests[index], [field]: value };
    updateField('guests', newGuests);
  };

  return (
    <SectionWrapper id="rsvp">
      <Content ref={sectionRef}>
        <Eyebrow $visible={visible}>Antworten</Eyebrow>
        <Title $visible={visible}>{title}</Title>

        {submitted ? (
          <SuccessState>
            <SuccessIcon>{formData.attending ? '✓' : '♡'}</SuccessIcon>
            <SuccessTitle>{formData.attending ? 'Danke!' : 'Schade!'}</SuccessTitle>
            <SuccessText>
              {formData.attending 
                ? 'Vielen Dank! Wir freuen uns auf euch!' 
                : 'Schade, dass ihr nicht dabei sein könnt. Danke für die Rückmeldung!'}
            </SuccessText>
          </SuccessState>
        ) : (
        <Form onSubmit={handleSubmit} $visible={visible}>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <FormGroup>
            <Label>Name *</Label>
            <Input
              type="text"
              placeholder="Vor- und Nachname"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>E-Mail *</Label>
            <Input
              type="email"
              placeholder="email@beispiel.de"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </FormGroup>

          <RadioGroup>
            <RadioLabel $checked={formData.attending === true}>
              <input
                type="radio"
                checked={formData.attending === true}
                onChange={() => updateField('attending', true)}
              />
              Zusage
            </RadioLabel>
            <RadioLabel $checked={formData.attending === false}>
              <input
                type="radio"
                checked={formData.attending === false}
                onChange={() => updateField('attending', false)}
              />
              Absage
            </RadioLabel>
          </RadioGroup>

          {formData.attending && (
            <>
              <FormGroup>
                <Label>Anzahl Personen</Label>
                <Select
                  value={formData.persons}
                  onChange={(e) => handlePersonsChange(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                  ))}
                </Select>
              </FormGroup>

              {/* Single person */}
              {formData.persons === 1 && (askDietary || askAllergies) && (
                <>
                  {askDietary && (
                    <FormGroup>
                      <Label>Ernährung</Label>
                      <Select
                        value={formData.dietary}
                        onChange={(e) => updateField('dietary', e.target.value)}
                      >
                        <option value="">Keine besonderen Wünsche</option>
                        <option value="vegetarisch">Vegetarisch</option>
                        <option value="vegan">Vegan</option>
                        <option value="andere">Andere</option>
                      </Select>
                    </FormGroup>
                  )}
                  {askAllergies && (
                    <FormGroup>
                      <Label>Allergien / Unverträglichkeiten</Label>
                      <Input
                        type="text"
                        value={formData.allergies}
                        onChange={(e) => updateField('allergies', e.target.value)}
                        placeholder="z.B. Nüsse, Laktose..."
                      />
                    </FormGroup>
                  )}
                </>
              )}

              {/* Multiple persons */}
              {formData.persons > 1 && (askDietary || askAllergies) && (
                <GuestSection>
                  <GuestSectionTitle>Angaben pro Person</GuestSectionTitle>
                  {Array.from({ length: formData.persons }, (_, i) => {
                    const guest = formData.guests?.[i] || { name: '', dietary: '', allergies: '' };
                    return (
                      <GuestCard key={i}>
                        <GuestNumber>Person {i + 1}{i === 0 ? ' (Hauptgast)' : ''}</GuestNumber>
                        <GuestFields>
                          {i > 0 && (
                            <Input
                              type="text"
                              value={guest.name}
                              onChange={(e) => updateGuest(i, 'name', e.target.value)}
                              placeholder={`Name Person ${i + 1}`}
                            />
                          )}
                          {askDietary && (
                            <Select
                              value={i === 0 ? formData.dietary : guest.dietary}
                              onChange={(e) => i === 0
                                ? updateField('dietary', e.target.value)
                                : updateGuest(i, 'dietary', e.target.value)
                              }
                            >
                              <option value="">Keine besonderen Wünsche</option>
                              <option value="vegetarisch">Vegetarisch</option>
                              <option value="vegan">Vegan</option>
                              <option value="andere">Andere</option>
                            </Select>
                          )}
                          {askAllergies && (
                            <Input
                              type="text"
                              value={i === 0 ? formData.allergies : guest.allergies}
                              onChange={(e) => i === 0
                                ? updateField('allergies', e.target.value)
                                : updateGuest(i, 'allergies', e.target.value)
                              }
                              placeholder="Allergien / Unverträglichkeiten"
                            />
                          )}
                        </GuestFields>
                      </GuestCard>
                    );
                  })}
                </GuestSection>
              )}
            </>
          )}

          {customQuestion && (
            <FormGroup>
              <Label>{customQuestion}</Label>
              <TextArea
                value={formData.customAnswer || ''}
                onChange={(e) => updateField('customAnswer', e.target.value)}
                placeholder="Deine Antwort..."
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Nachricht (optional)</Label>
            <TextArea
              value={formData.message}
              onChange={(e) => updateField('message', e.target.value)}
              placeholder="Eine persönliche Nachricht..."
            />
          </FormGroup>

          <SubmitBtn type="submit" disabled={submitting}>
            {submitting ? 'Wird gesendet...' : 'Absenden'}
          </SubmitBtn>
        </Form>
        )}
      </Content>
    </SectionWrapper>
  );
}

export default RSVP;
