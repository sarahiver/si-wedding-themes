// src/themes/cassis/RSVP.js – Zusage mit Personenzahl, Kinderalter und Sprache der Antwort
import React, { useEffect, useId } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
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
    maxPersons: max, childAges: rules.child_ages === true, language: lang || undefined, trimEmail: true,
    messages: {
      name: tt('errName'), email: tt('errEmail'), emailInvalid: tt('errEmailInvalid'), persons: tt('errPersons'),
      personsMax: tt('errPersonsMax', { max }), childAge: tt('errChildAge'), duplicate: tt('errDuplicate'), generic: tt('errGeneric'),
    },
  });
  const { formData, updateField, submit, submitting, submitted, error } = rsvp;
  // „Noch nichts gewählt" ist hier ein eigener Zustand: beide Knöpfe sind anfangs gleichwertig
  const [chosen, setChosen] = React.useState(false);

  // Gästeliste folgt der Personenzahl: Person 1 ist die anmeldende Person
  // und trägt immer den Namen aus dem Hauptfeld.
  useEffect(() => {
    const want = formData.attending ? formData.persons : 0;
    const cur = formData.guests || [];
    const next = Array.from({ length: want }, (_, i) => cur[i] || { name: '', is_child: false });
    if (next[0]) next[0] = { ...next[0], name: formData.name.trim(), is_child: false };
    if (JSON.stringify(next) !== JSON.stringify(cur)) updateField('guests', next);
  }, [formData.persons, formData.attending, formData.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const setGuest = (i, patch) => {
    const next = [...(formData.guests || [])];
    next[i] = { ...next[i], ...patch };
    if (!next[i].is_child) delete next[i].age;
    updateField('guests', next);
  };
  const choose = (attending) => { setChosen(true); updateField('attending', attending); if (!attending) updateField('persons', 1); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!chosen) return;
    await submit();
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
        <Form onSubmit={onSubmit} noValidate>
          <Field htmlFor={`${uid}-name`}>{tt('yourName')}
            <Input id={`${uid}-name`} name="name" autoComplete="name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} maxLength={120} />
          </Field>
          <Field htmlFor={`${uid}-email`}>{tt('email')}
            <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} maxLength={254} />
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
                  <button type="button" aria-label={tt('fewer')} disabled={formData.persons <= 1} onClick={() => updateField('persons', Math.max(1, formData.persons - 1))}>−</button>
                  <output aria-live="polite">{formData.persons}</output>
                  <button type="button" aria-label={tt('more')} disabled={formData.persons >= max} onClick={() => updateField('persons', Math.min(max, formData.persons + 1))}>+</button>
                </Stepper>
                <Hint style={{ marginTop: '0.5rem' }}>{tt('personsHint', { max })}</Hint>
              </div>

              {(formData.guests || []).slice(1).map((g, idx) => {
                const i = idx + 1;
                return (
                  <Guest key={i}>
                    <legend>{tt('guest', { n: i + 1 })}</legend>
                    <Row>
                      <Field htmlFor={`${uid}-g${i}`}>{tt('guestName')}
                        <Input id={`${uid}-g${i}`} value={g.name || ''} onChange={(e) => setGuest(i, { name: e.target.value })} maxLength={120} />
                      </Field>
                      <Check><input type="checkbox" checked={!!g.is_child} onChange={(e) => setGuest(i, { is_child: e.target.checked })} />{tt('child')}</Check>
                    </Row>
                    {g.is_child && rules.child_ages === true && (
                      <Field htmlFor={`${uid}-a${i}`} style={{ maxWidth: '10rem' }}>{tt('age')}
                        <Input id={`${uid}-a${i}`} type="number" inputMode="numeric" min={0} max={17} step={1} placeholder={tt('agePlaceholder')}
                          value={Number.isInteger(g.age) ? g.age : ''}
                          onChange={(e) => { const v = e.target.value; setGuest(i, { age: v === '' ? undefined : Math.trunc(Number(v)) }); }} />
                      </Field>
                    )}
                  </Guest>
                );
              })}

              {c.ask_dietary && (
                <Field htmlFor={`${uid}-diet`}>{tt('dietary')}
                  <Input id={`${uid}-diet`} value={formData.dietary} onChange={(e) => updateField('dietary', e.target.value)} maxLength={300} />
                </Field>
              )}
              {c.ask_allergies && (
                <Field htmlFor={`${uid}-all`}>{tt('allergies')}
                  <Input id={`${uid}-all`} value={formData.allergies} onChange={(e) => updateField('allergies', e.target.value)} maxLength={300} />
                </Field>
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

          <div aria-live="assertive">{error && <Err role="alert">{error}</Err>}</div>
          {chosen && <div><Button as="button" type="submit" $solid disabled={submitting}>{submitting ? tt('sending') : tt('send')}</Button></div>}
        </Form>
        </Body>
      </Inner>
    </Section>
  );
}
export default RSVP;
