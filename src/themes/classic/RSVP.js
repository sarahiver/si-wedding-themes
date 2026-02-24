import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useRSVP } from '../../components/shared/RSVPCore';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`position:relative;overflow:hidden;min-height:100vh;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(6rem,12vh,10rem) clamp(2rem,5vw,5rem);`;
const BgV = styled.div`position:absolute;inset:0;z-index:0;background:#1a1a1a;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) brightness(0.35);}`;
const Card = styled.div`position:relative;z-index:2;
  background:var(--c-white,#fff);border:8px solid white;
  box-shadow:0 30px 80px rgba(0,0,0,0.25);
  padding:clamp(2.5rem,5vw,4.5rem);max-width:520px;width:100%;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 1s var(--ease) forwards;`}`;
const Eye = styled.p`font-family:var(--font-s);font-size:1.6rem;color:var(--c-accent);text-align:center;margin-bottom:0.5rem;`;
const H2 = styled.h2`font-family:var(--font-d);font-size:clamp(2.2rem,5vw,3.2rem);font-weight:300;color:var(--c-text);text-align:center;margin-bottom:2rem;`;
const Lbl = styled.p`font-size:0.5rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--c-text-muted);margin:1.5rem 0 0.3rem;`;
const Inp = styled.input`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.08));
  background:transparent;color:var(--c-text);font-family:var(--font-b);font-size:0.85rem;font-weight:300;
  &::placeholder{color:var(--c-text-muted,#999);opacity:0.5;}&:focus{outline:none;border-color:var(--c-text-muted);}`;
const Sel = styled.select`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.08));
  background:transparent;color:var(--c-text);font-family:var(--font-b);font-size:0.85rem;
  &:focus{outline:none;border-color:var(--c-text-muted);}`;
const Txt = styled.textarea`width:100%;padding:0.9rem 0;border:none;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.08));
  background:transparent;color:var(--c-text);font-family:var(--font-b);font-size:0.85rem;min-height:70px;resize:vertical;
  &::placeholder{color:var(--c-text-muted,#999);opacity:0.5;}&:focus{outline:none;border-color:var(--c-text-muted);}`;
const TogRow = styled.div`display:flex;gap:1rem;margin-top:1rem;`;
const Tog = styled.button`flex:1;padding:0.85rem;border:1px solid ${p=>p.$a?'var(--c-dark)':'var(--c-border,rgba(0,0,0,0.08))'};
  background:${p=>p.$a?'var(--c-dark)':'transparent'};color:${p=>p.$a?'white':'var(--c-text-muted)'};
  font-family:var(--font-b);font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;`;
const Btn = styled.button`width:100%;padding:1.1rem;background:var(--c-dark,#1A1A1A);border:none;
  color:white;font-family:var(--font-b);font-size:0.6rem;letter-spacing:0.25em;text-transform:uppercase;
  margin-top:2.5rem;cursor:pointer;transition:opacity 0.4s;&:hover{opacity:0.8;}&:disabled{opacity:0.3;}`;
const Err = styled.p`font-size:0.75rem;color:#c44;text-align:center;margin-top:1rem;`;
const SuccT = styled.h3`font-family:var(--font-d);font-size:2.5rem;font-weight:300;color:var(--c-text);text-align:center;margin-bottom:1rem;`;
const SuccP = styled.p`font-size:0.85rem;color:var(--c-text-sec);text-align:center;`;

/* Guest detail section */
const GuestBox = styled.div`margin-top:1.5rem;padding:1.25rem;background:var(--c-cream,#faf9f7);border:1px solid var(--c-border,rgba(0,0,0,0.06));`;
const GuestTitle = styled.p`font-size:0.5rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--c-text-muted);
  margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));`;
const GuestCard = styled.div`padding:0.75rem 0;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.04));
  &:last-child{border-bottom:none;padding-bottom:0;}&:first-of-type{padding-top:0;}`;
const GuestNum = styled.span`font-size:0.5rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--c-accent,#999);
  font-weight:600;display:block;margin-bottom:0.6rem;`;

function RSVP(){
  const{content}=useWedding();const r=content?.rsvp||{};
  const{formData,submitting,submitted,error,updateField,submit}=useRSVP();
  const[ref,v]=useInView();
  const bgImage=r.background_image||content?.hero?.background_image||null;
  const askDietary = r.ask_dietary;
  const askAllergies = r.ask_allergies;
  const customQ = r.custom_question;
  const deadline = r.deadline;

  // Handle person count change — sync guests array (like Editorial)
  const handlePersonsChange = (newCount) => {
    const count = parseInt(newCount);
    updateField('persons', count);
    const currentGuests = formData.guests || [];
    if (count > currentGuests.length) {
      const newGuests = [...currentGuests];
      for (let i = currentGuests.length; i < count; i++) {
        newGuests.push({ name: '', dietary: '', allergies: '' });
      }
      updateField('guests', newGuests);
    } else {
      updateField('guests', currentGuests.slice(0, count));
    }
  };

  // Update a single guest's field
  const updateGuest = (index, field, value) => {
    const newGuests = [...(formData.guests || [])];
    if (!newGuests[index]) newGuests[index] = { name: '', dietary: '', allergies: '' };
    newGuests[index] = { ...newGuests[index], [field]: value };
    updateField('guests', newGuests);
  };

  const persons = formData.persons || 1;
  const attending = formData.attending;
  const showDetails = attending !== 'no' && attending !== false;

  if(submitted)return(
    <S id="rsvp"><BgV>{bgImage&&<img src={optimizedUrl.hero(bgImage)} alt=""/>}</BgV>
    <Card $v={true} ref={ref}><SuccT>Vielen Dank!</SuccT><SuccP>{attending===true?'Wir freuen uns auf euch!':'Schade – wir werden euch vermissen.'}</SuccP></Card></S>);

  return(
    <S id="rsvp">
      <BgV>{bgImage&&<img src={optimizedUrl.hero(bgImage)} alt=""/>}</BgV>
      <Card $v={v} ref={ref}>
        <Eye>wir freuen uns auf euch</Eye>
        <H2>{r.title||'RSVP'}</H2>
        {r.description&&<p style={{textAlign:'center',fontSize:'0.85rem',color:'var(--c-text-sec)',lineHeight:1.7,marginBottom:'1.5rem'}}>{r.description}</p>}
        {deadline&&<p style={{textAlign:'center',fontSize:'0.75rem',color:'var(--c-text-muted)',marginBottom:'2rem'}}>Bitte antwortet bis zum {new Date(deadline).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'})}</p>}
        <form onSubmit={e=>{e.preventDefault();submit();}}>
          <Lbl>Teilnahme</Lbl>
          <TogRow>
            <Tog type="button" $a={attending===true} onClick={()=>updateField('attending',true)}>Wir kommen gerne</Tog>
            <Tog type="button" $a={attending===false} onClick={()=>updateField('attending',false)}>Leider nicht</Tog>
          </TogRow>
          <Lbl>Name</Lbl><Inp placeholder="Euer Name" value={formData.name||''} onChange={e=>updateField('name',e.target.value)} required/>
          <Lbl>E-Mail</Lbl><Inp type="email" placeholder="email@beispiel.de" value={formData.email||''} onChange={e=>updateField('email',e.target.value)} required/>

          {showDetails&&<>
            <Lbl>Anzahl Personen</Lbl>
            <Sel value={persons} onChange={e=>handlePersonsChange(e.target.value)}>
              {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} {n===1?'Person':'Personen'}</option>)}
            </Sel>

            {/* Single person: simple fields */}
            {persons===1&&askDietary&&<><Lbl>Ernährungswünsche</Lbl><Sel value={formData.dietary||''} onChange={e=>updateField('dietary',e.target.value)}><option value="">Keine besonderen Wünsche</option><option value="vegetarisch">Vegetarisch</option><option value="vegan">Vegan</option><option value="pescetarisch">Pescetarisch</option><option value="glutenfrei">Glutenfrei</option><option value="sonstiges">Sonstiges</option></Sel></>}
            {persons===1&&askAllergies&&<><Lbl>Allergien / Unverträglichkeiten</Lbl><Inp placeholder="z.B. Nüsse, Laktose..." value={formData.allergies||''} onChange={e=>updateField('allergies',e.target.value)}/></>}

            {/* Multiple persons: per-person fields (like Editorial) */}
            {persons>1&&(askDietary||askAllergies)&&
              <GuestBox>
                <GuestTitle>Angaben pro Person</GuestTitle>
                {Array.from({length:persons},(_,i)=>{
                  const guest = formData.guests?.[i] || { name:'', dietary:'', allergies:'' };
                  return(
                    <GuestCard key={i}>
                      <GuestNum>Person {i+1}{i===0?' (Hauptgast)':''}</GuestNum>
                      {i>0&&<><Lbl style={{margin:'0 0 0.2rem'}}>Name</Lbl><Inp placeholder={`Name Person ${i+1}`} value={guest.name||''} onChange={e=>updateGuest(i,'name',e.target.value)}/></>}
                      {askDietary&&<><Lbl style={{margin:'0.75rem 0 0.2rem'}}>Ernährung</Lbl><Sel value={i===0?(formData.dietary||''):(guest.dietary||'')} onChange={e=>i===0?updateField('dietary',e.target.value):updateGuest(i,'dietary',e.target.value)}><option value="">Keine besonderen Wünsche</option><option value="vegetarisch">Vegetarisch</option><option value="vegan">Vegan</option><option value="pescetarisch">Pescetarisch</option><option value="glutenfrei">Glutenfrei</option><option value="sonstiges">Sonstiges</option></Sel></>}
                      {askAllergies&&<><Lbl style={{margin:'0.75rem 0 0.2rem'}}>Allergien</Lbl><Inp placeholder="z.B. Nüsse, Laktose..." value={i===0?(formData.allergies||''):(guest.allergies||'')} onChange={e=>i===0?updateField('allergies',e.target.value):updateGuest(i,'allergies',e.target.value)}/></>}
                    </GuestCard>
                  );
                })}
              </GuestBox>
            }
          </>}

          {showDetails&&customQ&&<><Lbl>{customQ}</Lbl><Txt placeholder="Deine Antwort..." value={formData.customAnswer||''} onChange={e=>updateField('customAnswer',e.target.value)} style={{minHeight:'50px'}}/></>}
          <Lbl>Nachricht</Lbl><Txt placeholder="Sonderwünsche, Grüße..." value={formData.message||''} onChange={e=>updateField('message',e.target.value)}/>
          <Btn type="submit" disabled={submitting}>{submitting?'Wird gesendet...':'Absenden'}</Btn>
          {error&&<Err>{error}</Err>}
        </form>
      </Card>
    </S>);
}
export default RSVP;
