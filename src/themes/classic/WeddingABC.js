import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-cream);`;
const Wrap = styled.div`max-width: 900px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Ttl = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem;`;
const Card = styled.div`background: var(--c-white); padding: 2rem; box-shadow: 0 8px 25px rgba(0,0,0,0.03); position: relative; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.5s var(--ease) forwards; animation-delay: ${p.$d};`}`;
const Letter = styled.span`font-family: var(--font-display); font-size: 3rem; font-weight: 300; color: var(--c-gold); position: absolute; top: 0.75rem; right: 1.25rem; opacity: 0.15;`;
const Word = styled.h3`font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; margin-bottom: 0.5rem;`;
const Meaning = styled.p`font-size: 0.75rem; font-weight: 300; color: var(--c-text-sec); line-height: 1.8;`;
const DEFS=[{letter:'A',word:'Anfang',meaning:'Jede große Liebe hat einen Anfang.'},{letter:'B',word:'Brautstrauß',meaning:'Wer fängt ihn? Die Spannung steigt!'},{letter:'D',word:'Danke',meaning:'Dass ihr diesen Tag mit uns feiert.'},{letter:'F',word:'Feiern',meaning:'Bis die Schuhe drücken!'},{letter:'H',word:'Hochzeit',meaning:'Der schönste Tag – mit euch.'},{letter:'L',word:'Liebe',meaning:'Die Basis von allem.'}];

function WeddingABC(){const{content}=useWedding();const a=content?.weddingabc||{};const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);const items=a.items?.length?a.items:DEFS;
return(<S id="weddingabc" ref={ref}><Wrap><Hdr><Eye $v={v}>Von A bis Z</Eye><Ttl $v={v}>{a.title||'Hochzeits-ABC'}</Ttl></Hdr><Grid>{items.map((item,i)=>(<Card key={i} $v={v} $d={`${0.2+i*0.06}s`}><Letter>{item.letter||item.buchstabe}</Letter><Word>{item.word||item.wort}</Word><Meaning>{item.meaning||item.bedeutung}</Meaning></Card>))}</Grid></Wrap></S>);}
export default WeddingABC;
