// Botanical RSVP - Clean form with multi-person support
import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cream);
  position: relative;
  scroll-snap-align: start;
  padding: 4rem 2rem;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--forest-light);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: var(--forest-deep);
`;

const Subtitle = styled.p`
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--bark-medium);
  margin-top: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--bark-medium);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  background: var(--warm-white);
  border: 1px solid var(--cream-dark);
  color: var(--soft-black);
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--forest-light);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  background: var(--warm-white);
  border: 1px solid var(--cream-dark);
  color: var(--soft-black);
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--forest-light);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-family: var(--font-sans);
  font-size: 1rem;
  background: var(--warm-white);
  border: 1px solid var(--cream-dark);
  color: var(--soft-black);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--forest-light);
  }
`;

const AttendanceChoice = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const AttendanceButton = styled.button`
  padding: 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  background: ${p => p.$selected ? 'var(--forest-deep)' : 'var(--warm-white)'};
  color: ${p => p.$selected ? 'var(--cream)' : 'var(--bark-medium)'};
  border: 1px solid ${p => p.$selected ? 'var(--forest-deep)' : 'var(--cream-dark)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--forest-light);
  }
`;

const GuestSection = styled.div`
  padding-top: 1rem;
  border-top: 1px solid var(--cream-dark);
`;

const GuestCard = styled.div`
  background: var(--warm-white);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const GuestHeader = styled.p`
  font-family: var(--font-sans);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--forest-light);
  margin-bottom: 0.75rem;
`;

const GuestFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const SmallInput = styled(Input)`
  padding: 0.75rem;
  font-size: 0.9rem;
`;

const SmallSelect = styled(Select)`
  padding: 0.75rem;
  font-size: 0.9rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--forest-deep);
  color: var(--cream);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    background: var(--forest-main);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`;

const SuccessTitle = styled.h3`
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 400;
  color: var(--forest-deep);
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--bark-medium);
`;

function RSVP() {
  const { content } = useWedding();
  const rsvpData = content?.rsvp || {};
  
  const title = rsvpData.title || 'Zusagen';
  const description = rsvpData.description || 'Wir freuen uns auf eure Antwort';
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
      <Section id="rsvp" data-section="rsvp">
        <Content>
          <SuccessCard>
            <SuccessTitle>
              {formData.attending ? 'Wunderbar!' : 'Schade!'}
            </SuccessTitle>
            <SuccessText>
              {formData.attending 
                ? 'Wir freuen uns sehr auf euch.' 
                : 'Danke für die Rückmeldung.'}
            </SuccessText>
          </SuccessCard>
        </Content>
      </Section>
    );
  }

  return (
    <Section id="rsvp" data-section="rsvp">
      <Content>
        <Header>
          <Eyebrow>Seid ihr dabei?</Eyebrow>
          <Title>{title}</Title>
          <Subtitle>{description}</Subtitle>
        </Header>
        
        <Form onSubmit={(e) => { e.preventDefault(); submit(); }}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Label>Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Vor- und Nachname"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>E-Mail</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="eure@email.de"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Könnt ihr kommen?</Label>
            <AttendanceChoice>
              <AttendanceButton
                type="button"
                $selected={formData.attending === true}
                onClick={() => updateField('attending', true)}
              >
                Ja, gerne
              </AttendanceButton>
              <AttendanceButton
                type="button"
                $selected={formData.attending === false}
                onClick={() => updateField('attending', false)}
              >
                Leider nicht
              </AttendanceButton>
            </AttendanceChoice>
          </FormGroup>
          
          {formData.attending && (
            <>
              <FormGroup>
                <Label>Anzahl Personen</Label>
                <Select
                  value={formData.persons}
                  onChange={e => handlePersonsChange(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Select>
              </FormGroup>
              
              {(askDietary || askAllergies) && formData.persons > 1 && (
                <GuestSection>
                  {Array.from({ length: formData.persons }, (_, i) => {
                    const guest = formData.guests?.[i] || {};
                    return (
                      <GuestCard key={i}>
                        <GuestHeader>Person {i + 1}{i === 0 ? ' (du)' : ''}</GuestHeader>
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
                              <option value="normal">Keine Einschränkungen</option>
                              <option value="vegetarisch">Vegetarisch</option>
                              <option value="vegan">Vegan</option>
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
                  })}
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
          
          <SubmitButton type="submit" disabled={!canSubmit || submitting}>
            {submitting ? 'Wird gesendet...' : 'Absenden'}
          </SubmitButton>
        </Form>
      </Content>
    </Section>
  );
}

export default RSVP;
