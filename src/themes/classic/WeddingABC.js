import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-cream);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:900px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,6vw,5rem);`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem;`;
const Card = styled.div`background:var(--c-white);padding:2rem;box-shadow:0 8px 25px rgba(0,0,0,0.02);position:relative;`;
const Letter = styled.span`font-family:var(--font-d);font-size:3rem;font-weight:300;color:rgba(0,0,0,0.04);position:absolute;top:0.75rem;right:1.25rem;`;
const Word = styled.h3`font-family:var(--font-d);font-size:1.3rem;font-weight:400;margin-bottom:0.5rem;`;
const Meaning = styled.p`font-size:0.72rem;color:var(--c-text-sec);line-height:1.8;`;
const DEFS=[{letter:'A',word:'Anfang',meaning:'Jede gro\u00DFe Liebe hat einen Anfang.'},{letter:'B',word:'Brautstrau\u00DF',meaning:'Wer f\u00E4ngt ihn?'},{letter:'D',word:'Danke',meaning:'Dass ihr diesen Tag mit uns feiert.'},{letter:'F',word:'Feiern',meaning:'Bis die Schuhe dr\u00FCcken!'},{letter:'H',word:'Hochzeit',meaning:'Der sch\u00F6nste Tag.'},{letter:'L',word:'Liebe',meaning:'Die Basis von allem.'}];
function WeddingABC(){const{content}=useWedding();const a=content?.weddingabc||{};const items=a.items?.length?a.items:DEFS;
return(<S id="weddingabc"><Wrap><Hdr><Eye>Von A bis Z</Eye><Title>{a.title||'Hochzeits-ABC'}</Title></Hdr><Grid>{items.map((it,i)=><Card key={i}><Letter>{it.letter||it.buchstabe}</Letter><Word>{it.word||it.wort}</Word><Meaning>{it.meaning||it.bedeutung}</Meaning></Card>)}</Grid></Wrap></S>);}
export default WeddingABC;
