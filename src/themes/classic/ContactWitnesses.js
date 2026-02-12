import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white);`;
const Wrap = styled.div`max-width: 800px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Ttl = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2.5rem;`;
const Card = styled.div`text-align: center; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.6s var(--ease) forwards; animation-delay: ${p.$d};`}`;
const Avatar = styled.img`width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1.5rem; border: 3px solid var(--c-gold); opacity: 0; ${p => p.$v && css`animation: ${scaleIn} 0.5s var(--ease) forwards; animation-delay: ${p.$d};`}`;
const CName = styled.h3`font-family: var(--font-display); font-size: 1.4rem; font-weight: 400; margin-bottom: 0.25rem;`;
const Role = styled.p`font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 0.75rem;`;
const Phone = styled.a`display: block; font-size: 0.8rem; color: var(--c-text-sec); margin-bottom: 0.25rem; text-decoration: none; &:hover { color: var(--c-gold-dark); }`;
const DEFS=[{name:'Lisa Müller',role:'Trauzeugin',phone:'+49 170 1234567',image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'},{name:'Tom Schmidt',role:'Trauzeuge',phone:'+49 171 7654321',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}];

function ContactWitnesses(){const{content}=useWedding();const c=content?.witnesses||{};const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);const w=c.items?.length?c.items:DEFS;
return(<S id="witnesses" ref={ref}><Wrap><Hdr><Eye $v={v}>Eure Ansprechpartner</Eye><Ttl $v={v}>{c.title||'Trauzeugen'}</Ttl></Hdr><Grid>{w.map((p,i)=>(<Card key={i} $v={v} $d={`${0.3+i*0.15}s`}><Avatar src={p.image||`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=200&background=C4A87C&color=fff`} alt={p.name} $v={v} $d={`${0.2+i*0.15}s`}/><CName>{p.name}</CName><Role>{p.role||p.rolle}</Role>{p.phone&&<Phone href={`tel:${p.phone}`}>{p.phone}</Phone>}{p.email&&<Phone href={`mailto:${p.email}`}>{p.email}</Phone>}</Card>))}</Grid></Wrap></S>);}
export default ContactWitnesses;
