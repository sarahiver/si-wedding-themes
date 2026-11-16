// src/themes/cassis/RSVP.js – Zusage mit Personenzahl, Kinderalter und Sprache der Antwort
import React, { useEffect, useId } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import { useLanguage, useLocalizedContent } from '../../lib/i18n';
import { formatWeddingDate } from './Hero';
import STRINGS from './strings';
import { C, FONT, Section, Inner, Title, Lead, Button } from './shared';

const Form = styled.form`display: grid; gap: 1.5rem; margin-top: 2rem;`;
const Field = styled.label`display: grid; gap: 0.4rem; font-size: 1.25rem; color: ${C.inkSoft};`;
const inputCss = `
  box-sizing: border-box; width: 100%; min-height: 3.25rem; padding: 0.6rem 0.9rem; border: 1px solid transparent; border-radius: 0;
  background: #fff; color: ${C.ink}; font-family: ${FONT}; font-weight: 300; font-size: 1.125rem;
  &:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
`;
const Input = styled.input`${inputCss}`;
const Area = styled.textarea`${inputCss} resize: vertical; min-height: 6rem;`;
const Choice = styled.div`display: grid; gap: 0.6rem;`;
const Stepper = styled.div`
  display: grid; grid-template-columns: 3.25rem 1fr 3.25rem; align-items: center; background: #fff; color: ${C.ink};
  button { height: 3.25rem; border: none; background: ${C.blueLight}; color: ${C.ink}; font-size: 1.6rem; font-family: ${FONT}; cursor: pointer; }
  button:disabled { opacity: 0.45; cursor: default; }
  button:focus-visible { outline: 2px solid ${C.ink}; outline-offset: 2px; }
  output { text-align: center; font-size: 1.5rem; }
`;
const Hint = styled.p`margin: 0; font-size: 1rem; color: ${C.inkSoft};`;
const Guest = styled.fieldset`
  margin: 0; padding: 1rem; border: 1px solid ${C.line}; display: grid; gap: 0.8rem;
  legend { padding: 0 0.4rem; font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${C.inkSoft}; }
`;
const Row = styled.div`display: grid; grid-template-columns: 1fr auto; gap: 0.8rem; align-items: end;`;
const Check = styled.label`
  display: flex; align-items: center; gap: 0.6rem; min-height: 2.75rem; font-size: 1.125rem; color: ${C.ink}; cursor: pointer;
  input { width: 1.25rem; height: 1.25rem; accent-color: ${C.blueDeep}; }
`;
const Err = styled.p`margin: 0; padding: 0.75rem 1rem; background: #fff; color: #8A1F2B; font-size: 1.0625rem;`;
const Done = styled.p`margin: 2rem 0 0; padding: 1.5rem; background: #fff; color: ${C.ink}; font-size: 1.375rem; line-height: 1.35; text-align: center;`;

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
      <Section id="rsvp" $tone="paper"><Inner>
        <Title $align="left">{c.title || tt('rsvpTitle')}</Title>
        <Done role="status">{tt(formData.attending ? 'thanksYes' : 'thanksNo')}</Done>
      </Inner></Section>
    );
  }

  const deadline = c.deadline ? formatWeddingDate(c.deadline, lang) : '';
  return (
    <Section id="rsvp" $tone="paper">
      <Inner>
        <Title $align="left">{c.title || tt('rsvpTitle')}</Title>
        {c.description && <Lead $align="left">{c.description}</Lead>}
        {deadline && <Hint>{tt('rsvpDeadline', { date: deadline })}</Hint>}

        <Form onSubmit={onSubmit} noValidate>
          <Field htmlFor={`${uid}-name`}>{tt('yourName')}
            <Input id={`${uid}-name`} name="name" autoComplete="name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} maxLength={120} />
          </Field>
          <Field htmlFor={`${uid}-email`}>{tt('email')}
            <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} maxLength={254} />
          </Field>

          <Choice role="group" aria-label={c.title || tt('rsvpTitle')}>
            <Button as="button" type="button" aria-pressed={chosen && formData.attending === true} onClick={() => choose(true)}
              style={chosen && formData.attending === true ? { outline: `2px solid ${C.ink}`, outlineOffset: '2px' } : undefined}>{tt('yes')}</Button>
            <Button as="button" type="button" $dark aria-pressed={chosen && formData.attending === false} onClick={() => choose(false)}
              style={chosen && formData.attending === false ? { outline: `2px solid ${C.ink}`, outlineOffset: '2px' } : undefined}>{tt('no')}</Button>
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
                <Hint style={{ marginTop: '0.4rem' }}>{tt('personsHint', { max })}</Hint>
              </div>

              {(formData.guests || []).slice(1).map((g, idx) => {
                const i = idx + 1;
                return (
                  <Guest key={i}>
                    <legend>{tt('guest', { n: i + 1 })}</legend>
                    <Row>
                      <Field htmlFor={`${uid}-g${i}`} style={{ fontSize: '1rem' }}>{tt('guestName')}
                        <Input id={`${uid}-g${i}`} value={g.name || ''} onChange={(e) => setGuest(i, { name: e.target.value })} maxLength={120} />
                      </Field>
                      <Check><input type="checkbox" checked={!!g.is_child} onChange={(e) => setGuest(i, { is_child: e.target.checked })} />{tt('child')}</Check>
                    </Row>
                    {g.is_child && rules.child_ages === true && (
                      <Field htmlFor={`${uid}-a${i}`} style={{ fontSize: '1rem', maxWidth: '10rem' }}>{tt('age')}
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
          {chosen && <Button as="button" type="submit" $dark disabled={submitting}>{submitting ? tt('sending') : tt('send')}</Button>}
        </Form>
      </Inner>
    </Section>
  );
}
export default RSVP;
