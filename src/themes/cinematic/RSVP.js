// src/themes/cinematic/RSVP.js
// Emotionalste Section neben dem Hero. Die Formularlogik kommt
// unverändert aus RSVPCore — hier ändert sich nur die Inszenierung.
import React from 'react';
import styled, { css } from 'styled-components';
import { focalCss } from '../../lib/focalPoint';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import MotionSection from './MotionSection';
import {
  palette, font, ease, dur, reveal, stagger, driftLayer, hoverable,
} from './motion';

const Media = styled.div`
  position: absolute;
  inset: -4%;
  background-image: url(${p => p.$src});
  background-size: cover;
  background-position: ${p => p.$focal?.desktop || 'center'};
  background-size: ${p => p.$focal?.desktopSize || 'cover'};
  opacity: 0.3;

  @media (max-width: 768px) {
    background-position: ${p => p.$focal?.mobile || 'center'};
    background-size: ${p => p.$focal?.mobileSize || 'cover'};

    /* Bildband statt Vollfläche — siehe Kommentar im Editorial-RSVP */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 28%, #000 72%, transparent 100%);
  }
  ${p => p.$shown && driftLayer}
`;

const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(70% 60% at 50% 40%, rgba(192,138,78,0.16), transparent 70%),
    linear-gradient(180deg, rgba(10,10,11,0.85), rgba(10,10,11,0.95));
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  z-index: 2;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 clamp(1.4rem, 5vw, 4rem);
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${font.display};
  font-weight: 200;
  font-size: clamp(2.4rem, 7vw, 5.4rem);
  line-height: 0.98;
  letter-spacing: -0.035em;
  ${reveal.cinematic(0)}

  em { font-style: italic; color: ${palette.ember}; }
`;

const Lead = styled.p`
  font-family: ${font.body};
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  line-height: 1.8;
  color: ${palette.bone};
  max-width: 40ch;
  margin: 1.8rem auto 0;
  ${reveal.editorial(200)}
`;

const Deadline = styled.p`
  font-family: ${font.body};
  font-size: 0.66rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${palette.ember};
  margin-top: 1.4rem;
  ${reveal.minimal(320)}
`;

const Form = styled.form`
  margin-top: clamp(3rem, 7vh, 4.5rem);
  display: grid;
  gap: 1.1rem;
  text-align: left;
  ${reveal.editorial(380)}
`;

const Field = styled.label`
  display: block;

  span {
    display: block;
    font-family: ${font.body};
    font-size: 0.62rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: ${palette.bone};
    margin-bottom: 0.6rem;
  }

  input, textarea, select {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(200,194,184,0.25);
    padding: 0.85rem 0;
    font-family: ${font.body};
    font-size: 1rem;
    color: ${palette.paper};
    transition: border-color ${dur.micro}ms ${ease};

    &:focus {
      outline: none;
      border-color: ${palette.ember};
    }
    &::placeholder { color: rgba(200,194,184,0.4); }
  }

  textarea { resize: vertical; min-height: 5rem; }
  select option { background: ${palette.charcoal}; }
`;

const Choice = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-top: 0.6rem;
`;

const Pick = styled.button`
  padding: 1rem;
  background: ${p => (p.$on ? 'rgba(192,138,78,0.16)' : 'transparent')};
  border: 1px solid ${p => (p.$on ? palette.ember : 'rgba(200,194,184,0.22)')};
  color: ${palette.paper};
  font-family: ${font.body};
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all ${dur.micro}ms ${ease};

  ${hoverable(css`border-color: ${palette.ember};`)}
  &:active { transform: scale(0.985); }
`;

const Submit = styled.button`
  position: relative;
  margin-top: 1.2rem;
  padding: 1.25rem 2.4rem;
  background: transparent;
  border: 1px solid ${palette.bone};
  border-radius: 999px;
  color: ${palette.paper};
  font-family: ${font.body};
  font-size: 0.72rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  transition: color ${dur.ui}ms ${ease}, border-color ${dur.ui}ms ${ease};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${palette.paper};
    transform: translateY(101%);
    transition: transform ${dur.ui}ms ${ease};
    z-index: -1;
  }

  ${hoverable(css`
    color: ${palette.ink};
    border-color: ${palette.paper};
    &::before { transform: translateY(0); }
  `)}

  &:active { transform: scale(0.99); }
  &:disabled { opacity: 0.5; cursor: wait; }
`;

const Done = styled.div`
  padding: clamp(2.5rem, 6vh, 4rem) 0;
  text-align: center;

  h3 {
    font-family: ${font.display};
    font-weight: 200;
    font-style: italic;
    font-size: clamp(1.8rem, 4vw, 3rem);
    color: ${palette.ember};
    margin-bottom: 1rem;
  }
  p { font-family: ${font.body}; color: ${palette.bone}; }
`;

const Err = styled.p`
  font-family: ${font.body};
  font-size: 0.82rem;
  color: #D98B8B;
  margin-top: 0.8rem;
`;

const RSVP = () => {
  const { content } = useWedding();
  const data = content?.rsvp || {};
  const { formData, submitting, submitted, error, updateField, submit } = useRSVP();

  const deadline = data.deadline
    ? new Date(data.deadline).toLocaleDateString('de-DE', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  const bg = (typeof data.background_media === 'string'
    ? data.background_media
    : data.background_media?.url) || '';

  const onSubmit = async (e) => { e.preventDefault(); await submit(); };

  return (
    <MotionSection id="rsvp" tone="void" noRule>
      {shown => (
        <>
          {bg && <Media $src={optimizedUrl.hero(bg)} $focal={focalCss(data.background_focal)} $shown={shown} aria-hidden="true" />}
          <Scrim aria-hidden="true" />
          <Inner>
            <Title $shown={shown}>
              {data.title || <>Seid ihr <em>dabei?</em></>}
            </Title>
            <Lead $shown={shown}>
              {data.description || 'Wir freuen uns auf eure Rückmeldung.'}
            </Lead>
            {deadline && <Deadline $shown={shown}>Bis {deadline}</Deadline>}

            {submitted ? (
              <Done>
                <h3>Danke.</h3>
                <p>Wir haben eure Rückmeldung erhalten.</p>
              </Done>
            ) : (
              <Form $shown={shown} onSubmit={onSubmit}>
                <Field>
                  <span>Name</span>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Euer Name"
                    required
                  />
                </Field>

                <Field>
                  <span>E-Mail</span>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="name@beispiel.de"
                  />
                </Field>

                <div>
                  <span style={{
                    display: 'block', fontFamily: font.body, fontSize: '0.62rem',
                    letterSpacing: '0.24em', textTransform: 'uppercase',
                    color: palette.bone, marginBottom: '0.6rem',
                  }}>Zusage</span>
                  <Choice>
                    <Pick type="button" $on={formData.attending === true}
                      onClick={() => updateField('attending', true)}>Wir kommen</Pick>
                    <Pick type="button" $on={formData.attending === false}
                      onClick={() => updateField('attending', false)}>Leider nicht</Pick>
                  </Choice>
                </div>

                {formData.attending && (
                  <Field>
                    <span>Anzahl Personen</span>
                    <input
                      type="number" min="1" max="10"
                      value={formData.guest_count || 1}
                      onChange={e => updateField('guest_count', Number(e.target.value))}
                    />
                  </Field>
                )}

                <Field>
                  <span>Nachricht</span>
                  <textarea
                    value={formData.message || ''}
                    onChange={e => updateField('message', e.target.value)}
                    placeholder="Möchtet ihr uns etwas mitgeben?"
                  />
                </Field>

                <Submit type="submit" disabled={submitting}>
                  {submitting ? 'Wird gesendet…' : 'Rückmeldung senden →'}
                </Submit>
                {error && <Err>{error}</Err>}
              </Form>
            )}
          </Inner>
        </>
      )}
    </MotionSection>
  );
};

export default RSVP;
