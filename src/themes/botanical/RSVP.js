// Botanical RSVP - Organic Nature Form with Multi-Person Support
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const fadeGrow = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const Section = styled.section`
  padding: var(--section-padding) 2rem;
  background: linear-gradient(
    180deg,
    var(--green-forest) 0%,
    var(--green-deep) 50%,
    var(--green-moss) 100%
  );
  position: relative;
  overflow: hidden;
`;

// Decorative floating leaves
const FloatingLeaf = styled.div`
  position: absolute;
  width: ${p => p.$size || '80px'};
  height: ${p => p.$size || '80px'};
  background: ${p => p.$color || 'var(--green-sage)'};
  opacity: ${p => p.$opacity || 0.15};
  border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%;
  animation: ${sway} ${p => p.$duration || '10s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  z-index: 0;
`;

const Container = styled.div`
  max-width: var(--container-tight);
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Eyebrow = styled.div`
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--green-mint);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-handwritten);
  font-size: clamp(3rem, 10vw, 5rem);
  color: var(--bg-cream);
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 1.1rem;
  color: var(--green-mint);
  margin-top: 0.5rem;
  opacity: 0.9;
`;

// Organic form container
const FormCard = styled.div`
  background: var(--bg-cream);
  padding: clamp(2rem, 6vw, 3rem);
  border-radius: 50px 50px 40px 60px / 40px 60px 50px 50px;
  box-shadow: var(--shadow-deep);
  animation: ${fadeGrow} 0.8s var(--ease-nature);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--bg-fog);
  border: 2px solid var(--bg-moss);
  border-radius: 25px;
  color: var(--text-dark);
  transition: all 0.3s var(--ease-nature);
  
  &:focus {
    outline: none;
    border-color: var(--green-fern);
    box-shadow: 0 0 0 4px rgba(92, 138, 77, 0.15);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--bg-fog);
  border: 2px solid var(--bg-moss);
  border-radius: 25px;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.3s var(--ease-nature);
  
  &:focus {
    outline: none;
    border-color: var(--green-fern);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.25rem;
  font-family: var(--font-body);
  font-size: 1rem;
  background: var(--bg-fog);
  border: 2px solid var(--bg-moss);
  border-radius: 25px;
  color: var(--text-dark);
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s var(--ease-nature);
  
  &:focus {
    outline: none;
    border-color: var(--green-fern);
  }
`;

// Attendance choice
const AttendanceChoice = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const AttendanceButton = styled.button`
  padding: 1.5rem;
  background: ${p => p.$selected 
    ? (p.$yes ? 'var(--green-fern)' : 'var(--earth-clay)') 
    : 'var(--bg-fog)'};
  color: ${p => p.$selected ? 'var(--bg-cream)' : 'var(--text-medium)'};
  border: 2px solid ${p => p.$selected 
    ? (p.$yes ? 'var(--green-forest)' : 'var(--earth-bark)') 
    : 'var(--bg-moss)'};
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s var(--ease-nature);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-soft);
    ${p => !p.$selected && css`
      background: var(--bg-moss);
    `}
  }
  
  .emoji {
    font-size: 1.75rem;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

// Guest cards for multiple persons
const GuestSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed var(--bg-moss);
`;

const GuestSectionTitle = styled.h4`
  font-family: var(--font-handwritten);
  font-size: 1.5rem;
  color: var(--green-forest);
  margin-bottom: 1rem;
`;

const GuestCard = styled.div`
  background: var(--bg-fog);
  padding: 1.25rem;
  border-radius: 25px;
  margin-bottom: 1rem;
`;

const GuestHeader = styled.div`
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--green-fern);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GuestFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const SmallInput = styled(Input)`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
`;

const SmallSelect = styled(Select)`
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, var(--green-fern) 0%, var(--green-forest) 100%);
  color: var(--bg-cream);
  border: none;
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  transition: all 0.4s var(--ease-nature);
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: var(--shadow-deep), var(--shadow-glow);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(193, 127, 89, 0.15);
  border: 2px solid var(--earth-clay);
  color: var(--earth-bark);
  padding: 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
`;

// Success State
const SuccessCard = styled.div`
  text-align: center;
  padding: 3rem 2rem;
`;

const SuccessEmoji = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: ${sway} 3s ease-in-out infinite;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-handwritten);
  font-size: 2.5rem;
  color: var(--green-forest);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1.1rem;
  color: var(--text-medium);
`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'Zusagen';
  const description = rsvpData.description || 'Wir freuen uns auf eure Antwort!';
  const deadline = rsvpData.deadline;
  const askDietary = rsvpData.ask_dietary !== false;
  const askAllergies = rsvpData.ask_allergies !== false;
  
  const {
    formData,
    submitting,
    submitted,
    error,
    updateField,
    submit,
  } = useRSVP();

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

  const canSubmit = formData.name && formData.email && formData.attending !== null;

  if (submitted) {
    return (
      <Section id="rsvp">
        <Container>
          <FormCard>
            <SuccessCard>
              <SuccessEmoji>{formData.attending ? '🌿' : '🍂'}</SuccessEmoji>
              <SuccessTitle>
                {formData.attending ? 'Wunderbar!' : 'Schade!'}
              </SuccessTitle>
              <SuccessText>
                {formData.attending 
                  ? 'Wir freuen uns sehr, euch bald zu sehen!' 
                  : 'Danke für die Rückmeldung. Ihr werdet uns fehlen!'}
              </SuccessText>
            </SuccessCard>
          </FormCard>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="rsvp">
      {/* Floating decorations */}
      <FloatingLeaf $size="120px" $color="var(--green-mint)" $opacity={0.1} style={{ top: '10%', left: '5%' }} />
      <FloatingLeaf $size="80px" $color="var(--green-sage)" $opacity={0.08} style={{ bottom: '20%', right: '8%' }} $duration="12s" $delay="-3s" />
      <FloatingLeaf $size="60px" $color="var(--accent-sunlight)" $opacity={0.06} style={{ top: '40%', right: '5%' }} $duration="15s" $delay="-5s" />
      
      <Container>
        <Header>
          <Eyebrow>🌿 Seid ihr dabei?</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
          {deadline && (
            <Subtitle style={{ marginTop: '0.5rem', opacity: 0.7 }}>
              Bitte antwortet bis zum {new Date(deadline).toLocaleDateString('de-DE')}
            </Subtitle>
          )}
        </Header>
        
        <FormCard>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label>Euer Name *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Vor- und Nachname"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>E-Mail *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="eure@email.de"
            />
          </FormGroup>
          
          <Label>Könnt ihr kommen? *</Label>
          <AttendanceChoice>
            <AttendanceButton
              type="button"
              $yes
              $selected={formData.attending === true}
              onClick={() => updateField('attending', true)}
            >
              <span className="emoji">🌸</span>
              Ja, gerne!
            </AttendanceButton>
            <AttendanceButton
              type="button"
              $selected={formData.attending === false}
              onClick={() => updateField('attending', false)}
            >
              <span className="emoji">🍂</span>
              Leider nicht
            </AttendanceButton>
          </AttendanceChoice>
          
          {formData.attending && (
            <>
              <FormGroup>
                <Label>Anzahl Personen</Label>
                <Select
                  value={formData.persons}
                  onChange={e => handlePersonsChange(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>
                  ))}
                </Select>
              </FormGroup>
              
              {(askDietary || askAllergies) && (
                <GuestSection>
                  <GuestSectionTitle>Ernährung & Allergien</GuestSectionTitle>
                  
                  {formData.persons === 1 ? (
                    <GuestFields>
                      {askDietary && (
                        <SmallSelect
                          value={formData.dietary}
                          onChange={e => updateField('dietary', e.target.value)}
                        >
                          <option value="">Ernährung wählen...</option>
                          <option value="normal">Keine Einschränkungen</option>
                          <option value="vegetarisch">Vegetarisch</option>
                          <option value="vegan">Vegan</option>
                          <option value="andere">Andere</option>
                        </SmallSelect>
                      )}
                      {askAllergies && (
                        <SmallInput
                          type="text"
                          value={formData.allergies}
                          onChange={e => updateField('allergies', e.target.value)}
                          placeholder="Allergien..."
                        />
                      )}
                    </GuestFields>
                  ) : (
                    Array.from({ length: formData.persons }, (_, i) => {
                      const guest = formData.guests?.[i] || {};
                      return (
                        <GuestCard key={i}>
                          <GuestHeader>
                            <span>🌱</span>
                            Person {i + 1}{i === 0 ? ' (du)' : ''}
                          </GuestHeader>
                          <GuestFields>
                            {i > 0 && (
                              <SmallInput
                                type="text"
                                value={guest.name || ''}
                                onChange={e => updateGuest(i, 'name', e.target.value)}
                                placeholder="Name"
                              />
                            )}
                            {askDietary && (
                              <SmallSelect
                                value={i === 0 ? formData.dietary : guest.dietary || ''}
                                onChange={e => i === 0 
                                  ? updateField('dietary', e.target.value)
                                  : updateGuest(i, 'dietary', e.target.value)
                                }
                              >
                                <option value="">Ernährung...</option>
                                <option value="vegetarisch">Vegetarisch</option>
                                <option value="vegan">Vegan</option>
                                <option value="andere">Andere</option>
                              </SmallSelect>
                            )}
                            {askAllergies && (
                              <SmallInput
                                type="text"
                                value={i === 0 ? formData.allergies : guest.allergies || ''}
                                onChange={e => i === 0
                                  ? updateField('allergies', e.target.value)
                                  : updateGuest(i, 'allergies', e.target.value)
                                }
                                placeholder="Allergien..."
                              />
                            )}
                          </GuestFields>
                        </GuestCard>
                      );
                    })
                  )}
                </GuestSection>
              )}
            </>
          )}
          
          <FormGroup>
            <Label>Nachricht (optional)</Label>
            <TextArea
              value={formData.message}
              onChange={e => updateField('message', e.target.value)}
              placeholder="Möchtet ihr uns noch etwas mitteilen?"
            />
          </FormGroup>
          
          <SubmitButton 
            onClick={submit}
            disabled={!canSubmit || submitting}
          >
            {submitting ? '🌿 Wird gesendet...' : '🌿 Absenden'}
          </SubmitButton>
        </FormCard>
      </Container>
    </Section>
  );
}

export default RSVP;
