import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const fadeUp = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
const slideIn = keyframes`from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}`;
const slideOut = keyframes`from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-32px)}`;

function useInView(th = 0.08) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [th]);
  return [r, v];
}

const S = styled.section`
  position: relative;
  overflow: hidden;
  padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem);
  background: var(--c-bg-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  z-index: 2;

  /* Warm organic background blobs */
  &::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(193,57,43,0.07) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(193,127,36,0.06) 0%, transparent 65%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const Wrap = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 540px;
  opacity: 0;
  ${p => p.$v && css`animation: ${fadeUp} 0.9s var(--ease) forwards;`}
`;

/* Step indicator */
const Steps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
`;

const StepDot = styled.div`
  width: ${p => p.$active ? '28px' : '8px'};
  height: 8px;
  border-radius: 100px;
  background: ${p => p.$active ? 'var(--c-accent)' : p.$done ? 'var(--c-gold)' : 'var(--c-border-warm)'};
  transition: all 0.4s var(--ease);
`;

const StepLine = styled.div`
  flex: 1;
  height: 1px;
  background: var(--c-border-warm);
  max-width: 40px;
`;

const Card = styled.div`
  background: var(--c-cream);
  border-radius: var(--radius-lg);
  padding: clamp(2rem, 5vw, 3.5rem);
  box-shadow: 0 20px 60px rgba(44,36,22,0.08);
  border: 1px solid var(--c-border);
`;

const Eyebrow = styled.p`
  font-family: var(--font-s);
  font-size: clamp(1.3rem, 2vw, 1.6rem);
  color: var(--c-accent);
  text-align: center;
  margin-bottom: 0.4rem;
`;

const H2 = styled.h2`
  font-family: var(--font-d);
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 400;
  color: var(--c-text);
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: var(--font-b);
  font-size: 0.85rem;
  color: var(--c-text-muted);
  text-align: center;
  margin-bottom: 2rem;
`;

const StepContent = styled.div`
  animation: ${slideIn} 0.4s var(--ease) forwards;
`;

/* Attending toggle */
const TogRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Tog = styled.button`
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid ${p => p.$a ? 'var(--c-accent)' : 'var(--c-border)'};
  background: ${p => p.$a ? 'var(--c-accent)' : 'transparent'};
  color: ${p => p.$a ? 'white' : 'var(--c-text-sec)'};
  font-family: var(--font-b);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s var(--ease);
  font-weight: ${p => p.$a ? '500' : '400'};

  &:hover:not([disabled]) {
    border-color: var(--c-accent);
    color: var(--c-accent);
  }
`;

const Lbl = styled.p`
  font-family: var(--font-b);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-text-muted);
  margin: 1.25rem 0 0.4rem;
`;

const Inp = styled.input`
  width: 100%;
  padding: 0.85rem 0;
  border: none;
  border-bottom: 1.5px solid var(--c-border);
  background: transparent;
  color: var(--c-text);
  font-family: var(--font-b);
  font-size: 0.9rem;
  transition: border-color 0.2s;

  &::placeholder { color: var(--c-text-muted); opacity: 0.6; }
  &:focus { outline: none; border-color: var(--c-accent); }
`;

const Sel = styled.select`
  width: 100%;
  padding: 0.85rem 0;
  border: none;
  border-bottom: 1.5px solid var(--c-border);
  background: transparent;
  color: var(--c-text);
  font-family: var(--font-b);
  font-size: 0.9rem;
  cursor: pointer;
  appearance: none;

  &:focus { outline: none; border-color: var(--c-accent); }
`;

const Txt = styled.textarea`
  width: 100%;
  padding: 0.85rem 0;
  border: none;
  border-bottom: 1.5px solid var(--c-border);
  background: transparent;
  color: var(--c-text);
  font-family: var(--font-b);
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;

  &::placeholder { color: var(--c-text-muted); opacity: 0.6; }
  &:focus { outline: none; border-color: var(--c-accent); }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const BtnBack = styled.button`
  padding: 1rem 1.5rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--c-border);
  background: transparent;
  color: var(--c-text-sec);
  font-family: var(--font-b);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { border-color: var(--c-text-sec); }
`;

const Btn = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--c-accent);
  color: white;
  font-family: var(--font-b);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  font-weight: 500;

  &:hover:not(:disabled) { background: var(--c-accent-hover); transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Err = styled.p`
  font-size: 0.8rem;
  color: var(--c-accent);
  text-align: center;
  margin-top: 1rem;
`;

const Success = styled.div`
  text-align: center;
  padding: 2rem 0;

  .icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
`;

const SuccH = styled.h3`
  font-family: var(--font-d);
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  font-weight: 400;
  color: var(--c-text);
  margin-bottom: 0.75rem;
`;

const SuccP = styled.p`
  font-family: var(--font-b);
  font-size: 0.9rem;
  color: var(--c-text-muted);
  line-height: 1.7;
`;

function RSVP() {
  const { content } = useWedding();
  const r = content?.rsvp || {};
  const { formData, submitting, submitted, error, updateField, submit } = useRSVP();
  const [step, setStep] = useState(1); // 1, 2, 3
  const [ref, v] = useInView();

  const canNext1 = formData.attending;
  const canNext2 = formData.name && formData.email;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  if (submitted) return (
    <S id="rsvp">
      <Wrap $v={true} ref={ref}>
        <Card>
          <Success>
            <span className="icon">🌻</span>
            <SuccH>Vielen Dank!</SuccH>
            <SuccP>
              {formData.attending === 'yes'
                ? 'Wir freuen uns so sehr, dass ihr dabei seid! Bis bald.'
                : 'Schade, dass es nicht klappt — wir werden euch vermissen.'}
            </SuccP>
          </Success>
        </Card>
      </Wrap>
    </S>
  );

  return (
    <S id="rsvp" ref={ref}>
      <Wrap $v={v}>
        {/* Step dots */}
        <Steps>
          {[1, 2, 3].map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <StepLine />}
              <StepDot $active={step === s} $done={step > s} />
            </React.Fragment>
          ))}
        </Steps>

        <Card>
          <Eyebrow>seid ihr dabei?</Eyebrow>
          <H2>{r.title || 'Zusagen'}</H2>

          <form onSubmit={handleSubmit}>
            {/* STEP 1: Ja / Nein */}
            {step === 1 && (
              <StepContent>
                <Subtitle>Könnt ihr dabei sein?</Subtitle>
                <TogRow>
                  <Tog type="button" $a={formData.attending === 'yes'} onClick={() => updateField('attending', 'yes')}>
                    Ja, wir kommen! 🎉
                  </Tog>
                  <Tog type="button" $a={formData.attending === 'no'} onClick={() => updateField('attending', 'no')}>
                    Leider nein 😢
                  </Tog>
                </TogRow>
                <BtnRow>
                  <Btn type="button" onClick={handleNext} disabled={!canNext1}>
                    Weiter →
                  </Btn>
                </BtnRow>
              </StepContent>
            )}

            {/* STEP 2: Name, E-Mail, Personen, Menü */}
            {step === 2 && (
              <StepContent>
                <Subtitle>Eure Angaben</Subtitle>

                <Lbl>Name *</Lbl>
                <Inp
                  placeholder="Euer Name"
                  value={formData.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  required
                />

                <Lbl>E-Mail *</Lbl>
                <Inp
                  type="email"
                  placeholder="email@beispiel.de"
                  value={formData.email || ''}
                  onChange={e => updateField('email', e.target.value)}
                  required
                />

                {formData.attending !== 'no' && (
                  <>
                    <Lbl>Anzahl Personen</Lbl>
                    <Sel value={formData.guests || '1'} onChange={e => updateField('guests', e.target.value)}>
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>)}
                    </Sel>

                    {r.menu_options?.length > 0 && (
                      <>
                        <Lbl>Menüwahl</Lbl>
                        <Sel value={formData.menu || ''} onChange={e => updateField('menu', e.target.value)}>
                          <option value="">Bitte wählen…</option>
                          {r.menu_options.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </Sel>
                      </>
                    )}
                  </>
                )}

                <BtnRow>
                  <BtnBack type="button" onClick={handleBack}>← Zurück</BtnBack>
                  <Btn type="button" onClick={handleNext} disabled={!canNext2}>Weiter →</Btn>
                </BtnRow>
              </StepContent>
            )}

            {/* STEP 3: Freitexte — Allergien, Musikwunsch, Nachricht */}
            {step === 3 && (
              <StepContent>
                <Subtitle>Fast geschafft!</Subtitle>

                <Lbl>Allergien & Unverträglichkeiten</Lbl>
                <Inp
                  placeholder="z.B. Laktose, Nüsse..."
                  value={formData.dietary || ''}
                  onChange={e => updateField('dietary', e.target.value)}
                />

                <Lbl>Musikwunsch</Lbl>
                <Inp
                  placeholder="Welchen Song darf auf keiner Fall fehlen?"
                  value={formData.music || ''}
                  onChange={e => updateField('music', e.target.value)}
                />

                <Lbl>Nachricht ans Brautpaar</Lbl>
                <Txt
                  placeholder="Wir freuen uns über ein paar Worte von euch 💛"
                  value={formData.message || ''}
                  onChange={e => updateField('message', e.target.value)}
                />

                <BtnRow>
                  <BtnBack type="button" onClick={handleBack}>← Zurück</BtnBack>
                  <Btn type="submit" disabled={submitting}>
                    {submitting ? 'Wird gesendet…' : 'Absenden ✓'}
                  </Btn>
                </BtnRow>
                {error && <Err>{error}</Err>}
              </StepContent>
            )}
          </form>
        </Card>
      </Wrap>
    </S>
  );
}

export default RSVP;
