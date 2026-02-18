import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';

const fadeUp  = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
const slideIn = keyframes`from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}`;

function useInView(th=0.08){
  const r=useRef(null);const[v,setV]=useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});
  if(r.current)o.observe(r.current);return()=>o.disconnect();},[th]);
  return[r,v];
}

const S = styled.section`
  position:relative;overflow:hidden;
  padding:var(--section-pad) clamp(1.5rem,5vw,4rem);
  background:var(--c-bg-warm);
  display:flex;align-items:center;justify-content:center;min-height:80vh;z-index:2;
  &::before{content:'';position:absolute;top:-80px;right:-80px;width:360px;height:360px;
    background:radial-gradient(circle,rgba(193,57,43,.07) 0%,transparent 65%);border-radius:50%;pointer-events:none;}
  &::after{content:'';position:absolute;bottom:-60px;left:-60px;width:280px;height:280px;
    background:radial-gradient(circle,rgba(193,127,36,.06) 0%,transparent 65%);border-radius:50%;pointer-events:none;}
`;
const Wrap = styled.div`
  position:relative;z-index:2;width:100%;max-width:520px;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} .9s var(--ease) forwards;`}
`;
const Steps = styled.div`display:flex;align-items:center;justify-content:center;gap:.4rem;margin-bottom:2rem;`;
const StepDot = styled.div`
  height:7px;border-radius:100px;
  width:${p=>p.$a?'26px':'7px'};
  background:${p=>p.$a?'var(--c-accent)':p.$done?'var(--c-gold)':'var(--c-border-warm)'};
  transition:all .35s var(--ease);
`;
const StepLine = styled.div`flex:1;height:1px;background:var(--c-border-warm);max-width:36px;`;

const Card = styled.div`
  background:var(--c-cream);border-radius:var(--radius-lg);
  padding:clamp(2rem,5vw,3.5rem);
  box-shadow:0 20px 60px rgba(44,36,22,.08);
  border:1px solid var(--c-border);
`;
const Eyebrow  = styled.p`font-family:var(--font-s);font-size:clamp(1.2rem,2vw,1.5rem);color:var(--c-accent);text-align:center;margin-bottom:.3rem;`;
const H2       = styled.h2`font-family:var(--font-d);font-size:clamp(1.7rem,3.5vw,2.4rem);font-weight:400;color:var(--c-text);text-align:center;margin-bottom:.4rem;`;
const Sub      = styled.p`font-family:var(--font-b);font-size:.82rem;color:var(--c-text-muted);text-align:center;margin-bottom:1.75rem;line-height:1.6;`;
const StepWrap = styled.div`animation:${slideIn} .35s var(--ease) forwards;`;
const TogRow   = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:1.25rem;`;
const Tog = styled.button`
  padding:.9rem .5rem;border-radius:var(--radius-sm);
  border:1.5px solid ${p=>p.$a?'var(--c-accent)':'var(--c-border)'};
  background:${p=>p.$a?'var(--c-accent)':'transparent'};
  color:${p=>p.$a?'white':'var(--c-text-sec)'};
  font-family:var(--font-b);font-size:.82rem;cursor:pointer;
  transition:all .22s var(--ease);font-weight:${p=>p.$a?500:400};
  &:hover:not(:disabled){border-color:var(--c-accent);color:var(--c-accent);}
`;
const Lbl = styled.p`
  font-family:var(--font-b);font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;
  color:var(--c-text-muted);margin:1.1rem 0 .35rem;
`;
const Inp = styled.input`
  width:100%;padding:.8rem 0;border:none;border-bottom:1.5px solid var(--c-border);
  background:transparent;color:var(--c-text);font-family:var(--font-b);font-size:.88rem;
  transition:border-color .2s;
  &::placeholder{color:var(--c-text-muted);opacity:.55;}
  &:focus{outline:none;border-color:var(--c-accent);}
`;
const Sel = styled.select`
  width:100%;padding:.8rem 0;border:none;border-bottom:1.5px solid var(--c-border);
  background:transparent;color:var(--c-text);font-family:var(--font-b);font-size:.88rem;
  appearance:none;cursor:pointer;
  &:focus{outline:none;border-color:var(--c-accent);}
`;
const Txt = styled.textarea`
  width:100%;padding:.8rem 0;border:none;border-bottom:1.5px solid var(--c-border);
  background:transparent;color:var(--c-text);font-family:var(--font-b);font-size:.88rem;
  min-height:72px;resize:vertical;
  &::placeholder{color:var(--c-text-muted);opacity:.55;}
  &:focus{outline:none;border-color:var(--c-accent);}
`;
const BtnRow  = styled.div`display:flex;gap:.6rem;margin-top:1.75rem;`;
const BtnBack = styled.button`
  padding:.9rem 1.25rem;border-radius:var(--radius-sm);
  border:1.5px solid var(--c-border);background:transparent;
  color:var(--c-text-sec);font-family:var(--font-b);font-size:.7rem;
  letter-spacing:.1em;text-transform:uppercase;cursor:pointer;
  &:hover{border-color:var(--c-text-sec);}
`;
const Btn = styled.button`
  flex:1;padding:.9rem;border-radius:var(--radius-sm);border:none;
  background:var(--c-accent);color:white;
  font-family:var(--font-b);font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;
  cursor:pointer;font-weight:500;transition:background .2s,transform .2s;
  &:hover:not(:disabled){background:var(--c-accent-hover);transform:translateY(-1px);}
  &:disabled{opacity:.45;cursor:not-allowed;}
`;
const Err = styled.p`font-size:.78rem;color:var(--c-accent);text-align:center;margin-top:.75rem;`;
const SuccWrap = styled.div`text-align:center;padding:1.5rem 0;`;
const SuccIcon = styled.div`font-size:2.5rem;margin-bottom:1rem;`;
const SuccH    = styled.h3`font-family:var(--font-d);font-size:clamp(1.7rem,3vw,2.1rem);font-weight:400;color:var(--c-text);margin-bottom:.6rem;`;
const SuccP    = styled.p`font-family:var(--font-b);font-size:.87rem;color:var(--c-text-muted);line-height:1.7;`;

function RSVP(){
  const{content}=useWedding();
  /* Admin fields: title, description, ask_dietary, ask_allergies, custom_question */
  const r=content?.rsvp||{};
  const{formData,submitting,submitted,error,updateField,submit}=useRSVP();
  const[step,setStep]=useState(1);
  const[ref,v]=useInView();

  const canNext1=!!formData.attending;
  const canNext2=!!formData.name&&!!formData.email;

  if(submitted) return(
    <S id="rsvp"><Wrap $v={true} ref={ref}><Card>
      <SuccWrap>
        <SuccIcon>🌻</SuccIcon>
        <SuccH>Vielen Dank!</SuccH>
        <SuccP>{formData.attending==='yes'
          ?'Wir freuen uns so sehr, dass ihr dabei seid!'
          :'Schade, dass es nicht klappt — wir werden euch vermissen.'}</SuccP>
      </SuccWrap>
    </Card></Wrap></S>
  );

  return(
    <S id="rsvp" ref={ref}>
      <Wrap $v={v}>
        <Steps>
          {[1,2,3].map((s,i)=>(
            <React.Fragment key={s}>
              {i>0&&<StepLine/>}
              <StepDot $a={step===s} $done={step>s}/>
            </React.Fragment>
          ))}
        </Steps>
        <Card>
          <Eyebrow>seid ihr dabei?</Eyebrow>
          <H2>{r.title||'Zusagen'}</H2>
          <form onSubmit={e=>{e.preventDefault();submit();}}>

            {/* STEP 1: Ja / Nein */}
            {step===1&&<StepWrap>
              <Sub>Könnt ihr bei unserer Hochzeit dabei sein?</Sub>
              <TogRow>
                <Tog type="button" $a={formData.attending==='yes'} onClick={()=>updateField('attending','yes')}>Ja, wir kommen! 🎉</Tog>
                <Tog type="button" $a={formData.attending==='no'} onClick={()=>updateField('attending','no')}>Leider nein 😢</Tog>
              </TogRow>
              <BtnRow><Btn type="button" onClick={()=>setStep(2)} disabled={!canNext1}>Weiter →</Btn></BtnRow>
            </StepWrap>}

            {/* STEP 2: Name, Email, Personen, Dietary */}
            {step===2&&<StepWrap>
              <Sub>Eure Angaben</Sub>
              <Lbl>Name *</Lbl>
              <Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} required/>
              <Lbl>E-Mail *</Lbl>
              <Inp type="email" placeholder="email@beispiel.de" value={formData.email||''} onChange={e=>updateField('email',e.target.value)} required/>
              {formData.attending!=='no'&&<>
                <Lbl>Anzahl Personen</Lbl>
                <Sel value={formData.guests||'1'} onChange={e=>updateField('guests',e.target.value)}>
                  {[1,2,3,4].map(n=><option key={n} value={n}>{n} {n===1?'Person':'Personen'}</option>)}
                </Sel>
              </>}
              {/* ask_dietary from admin */}
              {r.ask_dietary&&<>
                <Lbl>Ernährung</Lbl>
                <Sel value={formData.dietary_type||''} onChange={e=>updateField('dietary_type',e.target.value)}>
                  <option value="">Keine Angabe</option>
                  <option value="vegetarisch">Vegetarisch</option>
                  <option value="vegan">Vegan</option>
                  <option value="fleisch">Fleisch</option>
                </Sel>
              </>}
              <BtnRow>
                <BtnBack type="button" onClick={()=>setStep(1)}>← Zurück</BtnBack>
                <Btn type="button" onClick={()=>setStep(3)} disabled={!canNext2}>Weiter →</Btn>
              </BtnRow>
            </StepWrap>}

            {/* STEP 3: Allergien, custom_question, Nachricht */}
            {step===3&&<StepWrap>
              <Sub>Fast geschafft!</Sub>
              {r.ask_allergies&&<>
                <Lbl>Allergien & Unverträglichkeiten</Lbl>
                <Inp placeholder="z.B. Laktose, Nüsse..." value={formData.allergies||''} onChange={e=>updateField('allergies',e.target.value)}/>
              </>}
              {r.custom_question&&<>
                <Lbl>{r.custom_question}</Lbl>
                <Inp placeholder="Eure Antwort" value={formData.custom_answer||''} onChange={e=>updateField('custom_answer',e.target.value)}/>
              </>}
              <Lbl>Nachricht ans Brautpaar</Lbl>
              <Txt placeholder="Wir freuen uns über ein paar Worte 💛" value={formData.message||''} onChange={e=>updateField('message',e.target.value)}/>
              <BtnRow>
                <BtnBack type="button" onClick={()=>setStep(2)}>← Zurück</BtnBack>
                <Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet…':'Absenden ✓'}</Btn>
              </BtnRow>
              {error&&<Err>{error}</Err>}
            </StepWrap>}
          </form>
        </Card>
      </Wrap>
    </S>
  );
}
export default RSVP;
