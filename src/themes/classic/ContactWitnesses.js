import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`
  padding:clamp(6rem,10vh,10rem) clamp(2rem,5vw,5rem);background:var(--c-cream,#F5F0EB);position:relative;z-index:2;
`;
const Wrap = styled.div`max-width:800px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,6vw,5rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted,#999);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:3rem;`;
const Card = styled.div`text-align:center;`;
const Av = styled.img`width:110px;height:110px;border-radius:50%;object-fit:cover;margin:0 auto 1.5rem;
  border:4px solid white;box-shadow:0 8px 25px rgba(0,0,0,0.06);filter:grayscale(30%);`;
const CN = styled.h3`font-family:var(--font-d);font-size:1.3rem;font-weight:400;margin-bottom:0.25rem;`;
const Role = styled.p`font-size:0.55rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--c-text-muted,#999);margin-bottom:0.75rem;`;
const Ph = styled.a`display:block;font-size:0.82rem;color:var(--c-text-sec,#555);margin-bottom:0.25rem;text-decoration:none;
  &:hover{color:var(--c-text,#111);}`;

function ContactWitnesses() {
  const { content } = useWedding();
  const c = content?.witnesses || {};
  const w = c.persons?.length ? c.persons : c.items?.length ? c.items : [
    {name:'Lisa Müller',role:'Trauzeugin',phone:'+49 170 1234567'},
    {name:'Tom Schmidt',role:'Trauzeuge',phone:'+49 171 7654321'}
  ];
  return (
    <S id="witnesses">
      <Wrap>
        <Hdr>
          <Eye>Eure Ansprechpartner</Eye>
          <Title>{c.title || 'Trauzeugen'}</Title>
        </Hdr>
        <Grid>
          {w.map((p,i) => (
            <Card key={i}>
              <Av src={p.image||`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name||'')}&size=200&background=F5F0EB&color=555`} alt={p.name||''} />
              <CN>{p.name || 'Ansprechpartner'}</CN>
              <Role>{p.role||p.rolle}</Role>
              {p.phone&&<Ph href={`tel:${p.phone.replace(/\s/g,'')}`}>📞 Anrufen</Ph>}
              {p.email&&<Ph href={`mailto:${p.email}`}>📧 E-Mail</Ph>}
            </Card>
          ))}
        </Grid>
      </Wrap>
    </S>
  );
}
export default ContactWitnesses;
