// src/themes/cassis/RSVP.js – Zusage mit Personenzahl, Kinderalter und Sprache der Antwort
import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP, needsHealthConsent } from '../../components/shared/RSVPCore';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { formatWeddingDate } from './helpers';
import STRINGS from './strings';
import { C, FONT, SERIF, Section, Inner, Aside, Body, Title, Lead, Button, DESK } from './shared';

// Fehlerfarbe: dunkles Rot, auf Blaugrau und auf hellem Grund gut lesbar
const ERR = '#6E1620';
const Form = styled.form`display: grid; gap: 1.75rem; ${DESK} { gap: 2.25rem; }`;
const Field = styled.label`display: grid; gap: 0.5rem; font-size: 1.0625rem; line-height: 1.35; color: ${C.ink}; ${DESK} { gap: 0.65rem; font-size: clamp(1.0625rem, 1.15vw, 1.25rem); }`;
const inputCss = `
  box-sizing: border-box; width: 100%; min-height: 3.25rem; padding: 0.6rem 0.9rem; border: 1px solid transparent; border-radius: 0;
  background: ${C.pearl}; color: ${C.ink}; font-family: ${FONT}; font-weight: 400; font-size: 1.0625rem;
  transition: background-color 0.2s ease;
  &:hover { background: ${C.white}; }
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; background: ${C.white}; }
  &[aria-invalid='true'] { border-color: ${ERR}; box-shadow: inset 0 0 0 1px ${ERR}; }
  ${DESK} { min-height: 4rem; padding: 0.8rem 1.1rem; font-size: clamp(1.0625rem, 1.15vw, 1.3125rem); }
`;
const Input = styled.input`${inputCss}`;
const Select = styled.select`${inputCss} appearance: none; -webkit-appearance: none; padding-right: 2.75rem; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='none' stroke='%2333353F' stroke-width='1.2'%3E%3Cpath d='M1 3 L5 7 L9 3'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.7rem;`;
// Ernährung und Allergien einer Person stehen ab Tablet nebeneinander
const Pair = styled.div`display: grid; gap: 0.9rem; @media (min-width: 640px) { grid-template-columns: 1fr 1fr; gap: 1rem; }`;
const Area = styled.textarea`${inputCss} resize: vertical; min-height: 6.5rem; line-height: 1.5;`;
// Die gewählte Antwort ist gefüllt und trägt einen Haken; die andere tritt zurück
const Choice = styled.div`
  display: grid; gap: 0.75rem; @media (min-width: 520px) { grid-template-columns: 1fr 1fr; }
  button[aria-pressed='true']::before { content: ''; flex: none; width: 0.45em; height: 0.85em; margin: -0.2em 0.75em 0 0; border: solid currentColor; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); }
  &[data-chosen='true'] button[aria-pressed='false'] { opacity: 0.6; }
  &[data-chosen='true'] button[aria-pressed='false']:hover, &[data-chosen='true'] button[aria-pressed='false']:focus-visible { opacity: 1; }
`;
const Stepper = styled.div`
  display: grid; grid-template-columns: 3.25rem 1fr 3.25rem; align-items: center; background: ${C.pearl}; color: ${C.ink}; max-width: 14rem;
  button { height: 3.25rem; border: none; background: transparent; color: ${C.ink}; font-size: 1.5rem; font-family: ${FONT}; font-weight: 300; cursor: pointer; }
  button:disabled { opacity: 0.35; cursor: default; }
  button:focus-visible { outline: 2px solid ${C.ink}; outline-offset: -2px; }
  output { text-align: center; font-size: 1.375rem; font-weight: 300; font-variant-numeric: tabular-nums; }
  ${DESK} { grid-template-columns: 4rem 1fr 4rem; max-width: 17rem; button { height: 4rem; } output { font-size: 1.625rem; } }
`;
const Hint = styled.p`margin: 0; font-size: 0.9375rem; line-height: 1.5; color: ${C.ink}; ${DESK} { font-size: clamp(0.9375rem, 1vw, 1.0625rem); }`;
const Guest = styled.fieldset`
  margin: 0; padding: 1.25rem 0 0; border: 0; border-top: 1px solid ${C.line}; display: grid; gap: 0.9rem; min-width: 0;
  legend { float: left; width: 100%; padding: 0; margin-bottom: 0.25rem; font-size: 1.0625rem; font-weight: 300; }
  legend + * { clear: both; }
`;
const Row = styled.div`display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: end;`;
const Check = styled.label`
  display: flex; align-items: center; gap: 0.6rem; min-height: 3.25rem; font-size: 1.0625rem; color: ${C.ink}; cursor: pointer;
  input { width: 1.25rem; height: 1.25rem; accent-color: ${C.deep}; }
  input[aria-invalid='true'] { outline: 2px solid ${ERR}; outline-offset: 2px; }
  span { line-height: 1.45; }
`;
const Err = styled.p`margin: 0; padding: 0.9rem 1.1rem; background: ${C.pearl}; color: ${ERR}; font-size: 1.0625rem; line-height: 1.45; border-left: 3px solid ${ERR}; ${DESK} { font-size: clamp(1.0625rem, 1.15vw, 1.25rem); }`;
const Done = styled.p`margin: 0; font-family: ${SERIF}; font-weight: 500; font-size: clamp(1.625rem, 6vw, 2rem); line-height: 1.25; ${DESK} { font-weight: 400; font-size: clamp(2rem, 2.8vw, 3.25rem); }`;

function RSVP() {
  const { project } = useWedding();
  const { lang, t } = useLanguage();
  const c = useLocalizedContent('rsvp');
  const rules = (project?.features && project.features.rsvp) || {};
  const max = Number.isInteger(rules.max_persons) ? rules.max_persons : 10;
  const uid = useId();

  const tt = (k, v) => t(STRINGS, k, v);
  const rsvp = useRSVP({
    maxPersons: max, childAges: rules.child_ages === true, language: lang || undefined, trimEmail: true, strictEmail: true, healthConsent: true,
    messages: {
      name: tt('errName'), email: tt('errEmail'), emailInvalid: tt('errEmailInvalid'), persons: tt('errPersons'),
      personsMax: tt('errPersonsMax', { max }), childAge: tt('errChildAge'), duplicate: tt('errDuplicate'), generic: tt('errGeneric'), consent: tt('errConsent'),
    },
  });
  // adjustPersons zählt vom jeweils aktuellen Stand aus – auch bei sehr schnellem Tippen geht kein Schritt verloren
  const { formData, updateField, adjustPersons, submit, submitting, submitted, error, errorCode } = rsvp;
  // „Noch nichts gewählt" ist hier ein eigener Zustand: beide Knöpfe sind anfangs gleichwertig
  const [chosen, setChosen] = useState(false);
  const formRef = useRef(null);
  // Zählt fehlgeschlagene Absendeversuche: danach springt der Fokus zum ersten fehlerhaften Feld
  const [failed, setFailed] = useState(0);
  // Eingaben einer Zusage bleiben erhalten, falls jemand kurz auf „Nein" und zurück wechselt
  const stash = useRef(null);

  // Gästeliste folgt der Personenzahl: Person 1 ist die anmeldende Person
  // und trägt immer den Namen aus dem Hauptfeld.
  useEffect(() => {
    const want = formData.attending ? formData.persons : 0;
    const cur = formData.guests || [];
    const saved = (stash.current && stash.current.guests) || [];
    const next = Array.from({ length: want }, (_, i) => cur[i] || saved[i] || { name: '', is_child: false });
    if (next[0]) next[0] = { ...next[0], name: formData.name.trim(), is_child: false };
    if (want > 0) stash.current = null; // einmal zurückgeholt, danach gilt wieder nur das Formular
    if (JSON.stringify(next) !== JSON.stringify(cur)) updateField('guests', next);
    // Die Länge der Liste gehört zu den Auslösern: Bei sehr schnellem Tippen auf „+" kann eine
    // ältere Aktualisierung eine neuere überholen – dann gleicht dieser Lauf die Liste wieder an.
  }, [formData.persons, formData.attending, formData.name, (formData.guests || []).length]); // eslint-disable-line react-hooks/exhaustive-deps

  const setGuest = (i, patch) => {
    const next = [...(formData.guests || [])];
    next[i] = { ...next[i], ...patch };
    if (!next[i].is_child) delete next[i].age;
    if (next[i].diet !== 'other') delete next[i].diet_note;
    if (!next[i].diet) delete next[i].diet;
    updateField('guests', next);
  };
  const choose = (attending) => {
    setChosen(true);
    if (!attending && formData.attending && (formData.guests || []).length) stash.current = { persons: formData.persons, guests: formData.guests };
    updateField('attending', attending);
    if (!attending) updateField('persons', 1);
    else if (stash.current) updateField('persons', stash.current.persons);
  };
  const guests = formData.guests || [];
  const askDiet = !!c.ask_dietary;
  const askAllergies = !!c.ask_allergies;
  const consentNeeded = formData.attending && needsHealthConsent(guests);

  // Welches Feld gehört zu welcher Meldung?
  const invalid = {
    name: errorCode === 'name',
    email: errorCode === 'email' || errorCode === 'emailInvalid' || errorCode === 'duplicate',
    age: errorCode === 'childAge',
    consent: errorCode === 'consent',
  };
  const ageBad = (g) => invalid.age && g && g.is_child && !(Number.isInteger(g.age) && g.age >= 0 && g.age <= 17);
  useEffect(() => {
    if (!failed || !formRef.current) return;
    const el = formRef.current.querySelector('[aria-invalid="true"]');
    if (el && typeof el.focus === 'function') el.focus();
  }, [failed]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!chosen) return;
    const result = await submit();
    if (!result || !result.success) setFailed((n) => n + 1);
  };

  if (submitted) {
    return (
      <Section id="rsvp" $tone="mist"><Inner>
        <Aside><Title>{c.title || tt('rsvpTitle')}</Title></Aside>
        <Body><Done role="status">{tt(formData.attending ? 'thanksYes' : 'thanksNo')}</Done></Body>
      </Inner></Section>
    );
  }

  const deadline = c.deadline ? formatWeddingDate(c.deadline, lang) : '';
  return (
    <Section id="rsvp" $tone="mist">
      <Inner>
        <Aside>
          <Title>{c.title || tt('rsvpTitle')}</Title>
          {c.description && <Lead $onMist>{c.description}</Lead>}
          {deadline && <Lead $onMist>{tt('rsvpDeadline', { date: deadline })}</Lead>}
        </Aside>
        <Body>
        <Form onSubmit={onSubmit} noValidate ref={formRef}>
          <Field htmlFor={`${uid}-name`}>{tt('yourName')}
            <Input id={`${uid}-name`} name="name" autoComplete="name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} maxLength={120}
              aria-invalid={invalid.name ? 'true' : undefined} aria-describedby={invalid.name ? `${uid}-err` : undefined} />
          </Field>
          <Field htmlFor={`${uid}-email`}>{tt('email')}
            <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} maxLength={254}
              aria-invalid={invalid.email ? 'true' : undefined} aria-describedby={invalid.email ? `${uid}-err` : undefined} />
          </Field>

          <Choice role="group" aria-label={c.title || tt('rsvpTitle')} data-chosen={chosen ? 'true' : 'false'}>
            <Button as="button" type="button" $block $solid={chosen && formData.attending === true} aria-pressed={chosen && formData.attending === true} onClick={() => choose(true)}>{tt('yes')}</Button>
            <Button as="button" type="button" $block $solid={chosen && formData.attending === false} aria-pressed={chosen && formData.attending === false} onClick={() => choose(false)}>{tt('no')}</Button>
          </Choice>

          {chosen && formData.attending && (
            <>
              <div>
                <Field as="div" id={`${uid}-persons`}>{tt('persons')}</Field>
                <Stepper role="group" aria-labelledby={`${uid}-persons`}>
                  <button type="button" aria-label={tt('fewer')} disabled={formData.persons <= 1} onClick={() => adjustPersons(-1)}>−</button>
                  <output aria-live="polite">{formData.persons}</output>
                  <button type="button" aria-label={tt('more')} disabled={formData.persons >= max} onClick={() => adjustPersons(1)}>+</button>
                </Stepper>
                <Hint style={{ marginTop: '0.5rem' }}>{tt('personsHint', { max })}</Hint>
              </div>

              {/* Jede Person hat ihre eigenen Angaben. Person 1 ist die anmeldende Person
                  und braucht nur dann einen eigenen Block, wenn nach Ernährung gefragt wird. */}
              {guests.map((g, i) => {
                if (i === 0 && !askDiet && !askAllergies) return null;
                return (
                  <Guest key={i} data-person={i + 1}>
                    <legend>{i === 0 && formData.name.trim() ? formData.name.trim() : tt('guest', { n: i + 1 })}</legend>
                    {i > 0 && (
                      <Row>
                        <Field htmlFor={`${uid}-g${i}`}>{tt('guestName')}
                          <Input id={`${uid}-g${i}`} value={g.name || ''} onChange={(e) => setGuest(i, { name: e.target.value })} maxLength={120} />
                        </Field>
                        <Check><input type="checkbox" checked={!!g.is_child} onChange={(e) => setGuest(i, { is_child: e.target.checked })} />{tt('child')}</Check>
                      </Row>
                    )}
                    {i > 0 && g.is_child && rules.child_ages === true && (
                      <Field htmlFor={`${uid}-a${i}`} style={{ maxWidth: '10rem' }}>{tt('age')}
                        <Input id={`${uid}-a${i}`} type="number" inputMode="numeric" min={0} max={17} step={1} placeholder={tt('agePlaceholder')}
                          value={Number.isInteger(g.age) ? g.age : ''} aria-invalid={ageBad(g) ? 'true' : undefined} aria-describedby={ageBad(g) ? `${uid}-err` : undefined}
                          onChange={(e) => { const v = e.target.value; setGuest(i, { age: v === '' ? undefined : Math.trunc(Number(v)) }); }} />
                      </Field>
                    )}
                    {(askDiet || askAllergies) && (
                      <Pair>
                        {askDiet && (
                          <Field htmlFor={`${uid}-d${i}`}>{tt('dietary')}
                            <Select id={`${uid}-d${i}`} data-field="diet" value={g.diet || 'none'} onChange={(e) => setGuest(i, { diet: e.target.value === 'none' ? undefined : e.target.value })}>
                              <option value="none">{tt('dietNone')}</option>
                              <option value="vegetarian">{tt('dietVegetarian')}</option>
                              <option value="vegan">{tt('dietVegan')}</option>
                              <option value="other">{tt('dietOther')}</option>
                            </Select>
                          </Field>
                        )}
                        {askAllergies && (
                          <Field htmlFor={`${uid}-al${i}`}>{tt('allergies')}
                            <Input id={`${uid}-al${i}`} data-field="allergies" value={g.allergies || ''} onChange={(e) => setGuest(i, { allergies: e.target.value })} maxLength={300} placeholder={tt('allergiesPlaceholder')} />
                          </Field>
                        )}
                      </Pair>
                    )}
                    {askDiet && g.diet === 'other' && (
                      <Field htmlFor={`${uid}-dn${i}`}>{tt('dietNote')}
                        <Input id={`${uid}-dn${i}`} data-field="diet_note" value={g.diet_note || ''} onChange={(e) => setGuest(i, { diet_note: e.target.value })} maxLength={200} />
                      </Field>
                    )}
                  </Guest>
                );
              })}

              {(askDiet || askAllergies) && <Hint>{tt('healthNote')}</Hint>}
              {consentNeeded && (
                <Check style={{ alignItems: 'flex-start' }}>
                  <input id={`${uid}-consent`} type="checkbox" checked={formData.healthConsent === true} onChange={(e) => updateField('healthConsent', e.target.checked)}
                    aria-invalid={invalid.consent ? 'true' : undefined} aria-describedby={invalid.consent ? `${uid}-err` : undefined} style={{ marginTop: '0.2rem', flex: 'none' }} />
                  <span>{tt('consent')}</span>
                </Check>
              )}

              {c.custom_question && (
                <Field htmlFor={`${uid}-cq`}>{c.custom_question}
                  <Input id={`${uid}-cq`} value={formData.customAnswer} onChange={(e) => updateField('customAnswer', e.target.value)} maxLength={500} />
                </Field>
              )}
            </>
          )}

          {chosen && (
            <Field htmlFor={`${uid}-msg`}>{tt('message')}
              <Area id={`${uid}-msg`} value={formData.message} onChange={(e) => updateField('message', e.target.value)} maxLength={2000} />
            </Field>
          )}

          <div aria-live="assertive">{error && <Err role="alert" id={`${uid}-err`}>{error}</Err>}</div>
          {chosen && <div><Button as="button" type="submit" $solid disabled={submitting}>{submitting ? tt('sending') : tt('send')}</Button></div>}
        </Form>
        </Body>
      </Inner>
    </Section>
  );
}
export default RSVP;
