// src/themes/cassis/RSVP.js – Zusage mit Personenzahl, Kinderalter und Sprache der Antwort
import React, { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP, needsHealthConsent } from '../../components/shared/RSVPCore';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import STRINGS from './strings';
import { C, FONT, SERIF, HEADING, Section, Inner, Aside, Body, Title, Lead, Button, DESK, G, reveal, useReveal } from './shared';
import { formatWeddingDate, follows, OWN_TITLE } from './helpers';

// Fehlerfarbe: dunkles Rot, auf hellem Grund gut lesbar
const ERR = '#6E1620';
// Die Antwort ist eine Karte wie aus der Einladung: doppelte Haarlinie, Schreiblinien statt Kästen.
// Sie ist die einzige Karte der Seite.
export const Card = styled.section`
  position: relative; z-index: 2; box-sizing: border-box; scroll-margin-top: 5.5rem; background: ${C.pearl}; color: ${C.ink};
  margin: 0 calc(${G} * -1 + 0.75rem); padding: 2.25rem 1.5rem 2.5rem;
  font-family: ${FONT}; font-size: 1.0625rem; line-height: 1.5;
  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 60px -32px rgba(51,53,63,0.55);
  &::before { content: ''; position: absolute; inset: 0.7rem; border: 1px solid ${C.haze}; pointer-events: none; }
  &::after { content: ''; position: absolute; inset: 1rem; border: 1px solid rgba(199,197,204,0.5); pointer-events: none; }
  > * { position: relative; z-index: 1; }
  ${DESK} { margin: 0; padding: clamp(2rem, 4.6vw, 5rem); }
  ${reveal}
`;
const Question = styled.h3`margin: 0; font-family: ${HEADING}; font-weight: 400; font-size: clamp(2.25rem, 3.4vw, 3.5rem); line-height: 1.2; text-align: center; overflow-wrap: anywhere;`;
const Rule = styled.div`width: 3.5rem; height: 1px; background: ${C.ink}; opacity: 0.6; margin: 1.5rem auto 2.5rem;`;
const Form = styled.form`display: grid; gap: 2rem;`;
const Field = styled.label`display: grid; gap: 0.5rem; min-width: 0; overflow-wrap: anywhere; font-size: 0.75rem; line-height: 1.4; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.inkSoft}; transition: color 0.2s ease; &:focus-within { color: ${C.ink}; }`;
const inputCss = `
  box-sizing: border-box; width: 100%; min-height: 3rem; padding: 0.3rem 0; border: 0; border-bottom: 1px dotted ${C.ink}; border-radius: 0;
  background: transparent; color: ${C.ink}; font-family: ${SERIF}; font-weight: 400; font-size: clamp(1.375rem, 1.7vw, 1.625rem); letter-spacing: 0; text-transform: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &::placeholder { color: #8F8D98; font-style: italic; opacity: 1; }
  &:hover { border-bottom-style: solid; }
  &:focus-visible { outline: 0; border-bottom-style: solid; box-shadow: 0 1px 0 ${C.ink}; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
  &[aria-invalid='true'] { border-bottom: 1px solid ${ERR}; box-shadow: 0 1px 0 ${ERR}; }
`;
const Input = styled.input`${inputCss}`;
const Select = styled.select`${inputCss} appearance: none; -webkit-appearance: none; padding-right: 2rem; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='none' stroke='%2333353F' stroke-width='1.2'%3E%3Cpath d='M1 3 L5 7 L9 3'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.25rem center; background-size: 0.7rem;`;
// Ernährung und Allergien einer Person stehen ab Tablet nebeneinander
// Nebeneinander, sobald die Karte selbst breit genug ist (nicht das Fenster) – sonst untereinander
const Pair = styled.div`display: grid; gap: 1.5rem; align-items: end; grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));`;
// Nachricht: Schreiblinien wie auf einer Karte
const Area = styled.textarea`${inputCss} border: 0; padding: 0.2rem 0; resize: vertical; min-height: 7.2rem; font-size: 1.375rem; line-height: 2.4rem;
  background: repeating-linear-gradient(to bottom, transparent 0, transparent calc(2.4rem - 1px), ${C.haze} calc(2.4rem - 1px), ${C.haze} 2.4rem);
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 4px; box-shadow: none; }`;
// Zu- und Absage zum Ankreuzen. Vor der Wahl sind beide gleichwertig.
const Choice = styled.div`
  display: grid; gap: 0.5rem 1rem; padding: 1.25rem 0; border-top: 1px solid ${C.haze}; border-bottom: 1px solid ${C.haze};
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  button {
    display: flex; align-items: center; justify-content: center; gap: 0.9rem; min-height: 3.25rem; padding: 0; border: 0; background: none; cursor: pointer;
    font-family: ${SERIF}; font-size: clamp(1.5rem, 2vw, 2rem); line-height: 1.1; color: ${C.ink}; transition: color 0.2s ease;
  }
  button::before { content: ''; flex: none; box-sizing: border-box; width: 1.1rem; height: 1.1rem; border: 1px solid ${C.ink};
    background: no-repeat center / 0.7rem url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'/%3E"); }
  button:hover::before { box-shadow: 0 0 0 3px ${C.shell}; }
  button[aria-pressed='true']::before { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%2333353F' stroke-width='1.6'%3E%3Cpath d='M1.5 6.5 L4.8 9.6 L10.5 2.4'/%3E%3C/svg%3E"); }
  &[data-chosen='true'] button[aria-pressed='false'] { color: ${C.inkSoft}; }
  button:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;
const Persons = styled.div`display: grid; justify-items: center; gap: 0.6rem; text-align: center;`;
const Stepper = styled.div`
  display: grid; grid-template-columns: 3rem 3.5rem 3rem; align-items: center;
  button { width: 3rem; height: 3rem; border: 1px solid ${C.haze}; border-radius: 50%; background: transparent; color: ${C.ink}; font-size: 1.25rem; font-family: ${FONT}; font-weight: 300; cursor: pointer; }
  button { transition: background-color 0.2s ease, border-color 0.2s ease; }
  button:hover:not(:disabled) { background: ${C.shell}; border-color: ${C.ink}; }
  button:disabled { opacity: 0.35; cursor: default; }
  button:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  output { text-align: center; font-family: ${SERIF}; font-size: 2rem; line-height: 1; font-variant-numeric: lining-nums; }
`;
const Hint = styled.p`margin: 0; font-size: 0.9375rem; line-height: 1.5; color: ${C.inkSoft}; letter-spacing: 0; text-transform: none;`;
const Note = styled.p`margin: 0; text-align: center; font-family: ${SERIF}; font-style: italic; font-size: 1.125rem; line-height: 1.5; color: ${C.inkSoft};`;
const Guest = styled.fieldset`
  margin: 0; padding: 1.75rem 0 0; border: 0; border-top: 1px solid ${C.haze}; display: grid; gap: 1.5rem; min-width: 0;
  legend { float: left; width: 100%; padding: 0; text-align: center; font-family: ${SERIF}; font-style: italic; font-size: 1.5rem; line-height: 1.2; color: ${C.ink}; overflow-wrap: anywhere; }
  legend + * { clear: both; }
`;
const Row = styled.div`display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: end;`;
const Check = styled.label`
  display: flex; align-items: center; gap: 0.75rem; min-height: 3rem; font-size: 0.9375rem; line-height: 1.5; color: ${C.ink}; cursor: pointer;
  input { flex: none; appearance: none; -webkit-appearance: none; box-sizing: border-box; width: 1.1rem; height: 1.1rem; margin: 0; border: 1px solid ${C.ink}; border-radius: 0; background: transparent no-repeat center / 0.7rem; cursor: pointer; }
  input:checked { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%2333353F' stroke-width='1.6'%3E%3Cpath d='M1.5 6.5 L4.8 9.6 L10.5 2.4'/%3E%3C/svg%3E"); }
  input:hover { box-shadow: 0 0 0 3px ${C.shell}; }
  input:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 3px; }
  input[aria-invalid='true'] { outline: 2px solid ${ERR}; outline-offset: 2px; }
`;
const Err = styled.p`margin: 0; padding: 0.9rem 1.1rem; background: ${C.shell}; color: ${ERR}; font-size: 1.0625rem; line-height: 1.45; border-left: 3px solid ${ERR};`;
const Send = styled.div`text-align: center; button { min-width: min(14rem, 100%); font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; }`;
const Done = styled.p`margin: 0; text-align: center; font-family: ${SERIF}; font-style: italic; font-weight: 400; font-size: clamp(1.75rem, 2.6vw, 2.75rem); line-height: 1.25;`;

// Überschrift des Bereichs: steht neben der Karte (oder, mit der Anfahrt zusammen, über dem Château)
export function RsvpHead() {
  const { lang, t } = useLanguage();
  const c = useLocalizedContent('rsvp', OWN_TITLE);
  const deadline = c.deadline ? formatWeddingDate(c.deadline, lang) : '';
  return (
    <>
      <Title>{c.title || t(STRINGS, 'navRsvp')}</Title>
      {c.description && <Lead $onMist>{c.description}</Lead>}
      {deadline && <Lead $onMist>{t(STRINGS, 'rsvpDeadline', { date: deadline })}</Lead>}
    </>
  );
}

export function RsvpCard() {
  const { project } = useWedding();
  const { lang, t } = useLanguage();
  const c = useLocalizedContent('rsvp', OWN_TITLE);
  const rules = (project?.features && project.features.rsvp) || {};
  const max = Number.isInteger(rules.max_persons) ? rules.max_persons : 10;
  const uid = useId();
  const cardRef = useReveal();

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
  // Absenden ohne Wahl: eigene Meldung, bis Ja oder Nein gewählt ist
  const [needChoice, setNeedChoice] = useState(false);
  const yesRef = useRef(null);
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
    // Läuft nach jeder Darstellung: Tippt jemand sehr schnell, kann eine ältere Aktualisierung eine
    // neuere überholen und die Liste um einen Eintrag kürzen. Dieser Lauf gleicht sie dann wieder an;
    // stimmt alles, ändert er nichts.
  });

  const setGuest = (i, patch) => {
    const next = [...(formData.guests || [])];
    next[i] = { ...next[i], ...patch };
    if (!next[i].is_child) delete next[i].age;
    if (next[i].diet !== 'other') delete next[i].diet_note;
    if (!next[i].diet) delete next[i].diet;
    updateField('guests', next);
  };
  const choose = (attending) => {
    setChosen(true); setNeedChoice(false);
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
    if (!chosen) { setNeedChoice(true); if (yesRef.current) yesRef.current.focus(); return; }
    const result = await submit();
    if (!result || !result.success) setFailed((n) => n + 1);
  };

  if (submitted) {
    return (
      <Card id="rsvp" ref={cardRef}>
        <Question>{tt('rsvpTitle')}</Question><Rule />
        <Done role="status">{tt(formData.attending ? 'thanksYes' : 'thanksNo')}</Done>
      </Card>
    );
  }

  return (
      <Card id="rsvp" ref={cardRef}>
        <Question>{tt('rsvpTitle')}</Question><Rule />
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
            <button type="button" ref={yesRef} aria-describedby={needChoice ? `${uid}-choice` : undefined} aria-pressed={chosen && formData.attending === true} onClick={() => choose(true)}>{tt('yes')}</button>
            <button type="button" aria-pressed={chosen && formData.attending === false} onClick={() => choose(false)}>{tt('no')}</button>
          </Choice>

          {/* Die ganze Karte steht von Anfang an da; erst eine Absage blendet die Angaben zu den Personen aus */}
          {(!chosen || formData.attending) && (
            <>
              <Persons>
                <Field as="div" id={`${uid}-persons`}>{tt('persons')}</Field>
                <Stepper role="group" aria-labelledby={`${uid}-persons`}>
                  <button type="button" aria-label={tt('fewer')} disabled={formData.persons <= 1} onClick={() => adjustPersons(-1)}>−</button>
                  <output aria-live="polite">{formData.persons}</output>
                  <button type="button" aria-label={tt('more')} disabled={formData.persons >= max} onClick={() => adjustPersons(1)}>+</button>
                </Stepper>
                <Hint>{tt('personsHint', { max })}</Hint>
              </Persons>

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

              {(askDiet || askAllergies) && <Note>{tt('healthNote')}</Note>}
              {consentNeeded && (
                <Check style={{ alignItems: 'flex-start' }}>
                  <input id={`${uid}-consent`} type="checkbox" checked={formData.healthConsent === true} onChange={(e) => updateField('healthConsent', e.target.checked)}
                    aria-invalid={invalid.consent ? 'true' : undefined} aria-describedby={invalid.consent ? `${uid}-err` : undefined} style={{ marginTop: '0.2rem' }} />
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

          {(
            <Field htmlFor={`${uid}-msg`}>{tt('message')}
              <Area id={`${uid}-msg`} value={formData.message} onChange={(e) => updateField('message', e.target.value)} maxLength={2000} />
            </Field>
          )}

          <div aria-live="assertive">{error && <Err role="alert" id={`${uid}-err`}>{error}</Err>}</div>
          <div aria-live="assertive">{needChoice && !chosen && <Err role="alert" id={`${uid}-choice`}>{tt('errAttending')}</Err>}</div>
          <Send><Button as="button" type="submit" $solid disabled={submitting}>{submitting ? tt('sending') : tt('send')}</Button></Send>
        </Form>
      </Card>
  );
}

// Eigener Abschnitt – außer die Antwortkarte steht direkt hinter der Anfahrt:
// dann zeigt die Anfahrt beide auf einer Fläche (siehe Directions.js).
function RSVP() {
  const { project, isComponentActive } = useWedding();
  const d = useLocalizedContent('directions');
  const items = Array.isArray(d.items) ? d.items : (Array.isArray(d.options) ? d.options : []);
  const hasDirections = !!(d.description || d.address || d.note || items.some((x) => x && (x.title || x.description)));
  if (hasDirections && follows(project, isComponentActive, 'directions', 'rsvp')) return null;
  return (
    <Section $tone="mist">
      <Inner>
        <Aside><RsvpHead /></Aside>
        <Body><RsvpCard /></Body>
      </Inner>
    </Section>
  );
}
export default RSVP;
