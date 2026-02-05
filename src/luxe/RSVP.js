// Luxe RSVP - Elegant Dark Form with per-person dietary/allergies
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Section = styled.section`padding: var(--section-padding-y) var(--section-padding-x); background: var(--luxe-void);`;
const Container = styled.div`max-width: 600px; margin: 0 auto;`;

const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'};`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.1s;`;
const Subtitle = styled.p`font-family: var(--font-body); font-size: 0.9rem; color: var(--luxe-pearl); margin-top: 1rem; opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.2s;`;

const Form = styled.form`opacity: 0; animation: ${p => p.$visible ? css`${fadeUp} 0.8s var(--ease-out-expo) forwards` : 'none'}; animation-delay: 0.3s;`;
const FormGroup = styled.div`margin-bottom: 1.5rem;`;
const Label = styled.label`display: block; font-family: var(--font-body); font-size: 0.6rem; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; color: var(--luxe-slate); margin-bottom: 0.5rem;`;
const Input = styled.input`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; font-weight: 300; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); transition: border-color 0.3s ease; &:focus { outline: none; border-color: var(--luxe-gold); } &::placeholder { color: var(--luxe-slate); }`;
const TextArea = styled.textarea`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; font-weight: 300; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); min-height: 100px; resize: vertical; transition: border-color 0.3s ease; &:focus { outline: none; border-color: var(--luxe-gold); }`;
const Select = styled.select`width: 100%; padding: 1rem; font-family: var(--font-body); font-size: 1rem; color: var(--luxe-cream); background: var(--luxe-charcoal); border: 1px solid var(--luxe-graphite); cursor: pointer; &:focus { outline: none; border-color: var(--luxe-gold); } option { background: var(--luxe-charcoal); }`;

const RadioGroup = styled.div`display: flex; gap: 2rem; margin-top: 0.5rem;`;
const RadioLabel = styled.label`display: flex; align-items: center; gap: 0.75rem; font-family: var(--font-body); font-size: 0.9rem; color: var(--luxe-pearl); cursor: pointer; input { width: 16px; height: 16px; accent-color: var(--luxe-gold); }`;

const GuestSection = styled.div`margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--luxe-graphite);`;
const GuestSectionTitle = styled.h4`font-family: var(--font-display); font-size: 1rem; font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 1rem;`;
const GuestCard = styled.div`background: rgba(255,255,255,0.02); border: 1px solid var(--luxe-graphite); padding: 1rem; margin-bottom: 1rem;`;
const GuestNumber = styled.span`display: block; font-family: var(--font-body); font-size: 0.6rem; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; color: var(--luxe-gold); margin-bottom: 0.75rem;`;
const GuestFields = styled.div`display: grid; gap: 0.75rem;`;

const SubmitBtn = styled.button`width: 100%; padding: 1.25rem; font-family: var(--font-body); font-size: 0.7rem; font-weight: 400; letter-spacing: 0.25em; text-transform: uppercase; color: var(--luxe-void); background: var(--luxe-gold); border: none; cursor: pointer; margin-top: 1rem; transition: background 0.3s ease; &:hover { background: var(--luxe-champagne); } &:disabled { background: var(--luxe-graphite); cursor: not-allowed; }`;

const ErrorMessage = styled.p`background: rgba(196, 30, 58, 0.2); border: 1px solid rgba(196, 30, 58, 0.4); padding: 0.75rem 1rem; font-family: var(--font-body); font-size: 0.85rem; color: #ff6b6b; margin-bottom: 1rem;`;

const SuccessState = styled.div`text-align: center; padding: 4rem 2rem; opacity: 0; animation: ${fadeUp} 0.8s var(--ease-out-expo) forwards;`;
const SuccessIcon = styled.div`width: 70px; height: 70px; margin: 0 auto 1.5rem; border: 1px solid var(--luxe-gold); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--luxe-gold);`;
const SuccessTitle = styled.h3`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 300; font-style: italic; color: var(--luxe-cream); margin-bottom: 0.75rem;`;
const SuccessText = styled.p`font-family: var(--font-body); font-size: 0.95rem; color: var(--luxe-pearl); line-height: 1.7;`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  const title = rsvpData.title || 'Zusagen';
  const description = rsvpData.description || 'Wir freuen uns auf eure Rückmeldung';
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
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
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
    <Section ref={sectionRef} id="rsvp">
      <Container>
        <Header>
          <Eyebrow $visible={visible}>Antworten</Eyebrow>
          <Title $visible={visible}>{title}</Title>
          <Subtitle $visible={visible}>{description}</Subtitle>
        </Header>

        {submitted ? (
          <SuccessState>
            <SuccessIcon>{formData.attending ? '✓' : '♡'}</SuccessIcon>
            <SuccessTitle>{formData.attending ? 'Merci!' : 'Schade!'}</SuccessTitle>
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
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              placeholder="Vor- und Nachname"
            />
          </FormGroup>

          <FormGroup>
            <Label>E-Mail *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              placeholder="email@beispiel.de"
            />
          </FormGroup>

          <FormGroup>
            <Label>Teilnahme</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  checked={formData.attending === true}
                  onChange={() => updateField('attending', true)}
                />
                Ich komme gerne
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  checked={formData.attending === false}
                  onChange={() => updateField('attending', false)}
                />
                Leider nicht
              </RadioLabel>
            </RadioGroup>
          </FormGroup>

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

              {/* Single person - simple fields */}
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

              {/* Multiple persons - per-person fields */}
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
      </Container>
    </Section>
  );
}

export default RSVP;
