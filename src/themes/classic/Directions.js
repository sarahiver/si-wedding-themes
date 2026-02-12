import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white);`;
const Wrap = styled.div`max-width: 900px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.3s;`}`;
const Card = styled.div`text-align: center; padding: 2rem 1rem;`;
const Icon = styled.div`width: 50px; height: 50px; border-radius: 50%; background: rgba(196,168,124,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.3rem;`;
const CTitle = styled.h3`font-family: var(--font-display); font-size: 1.3rem; font-weight: 400; margin-bottom: 0.5rem;`;
const CText = styled.p`font-size: 0.8rem; font-weight: 300; color: var(--c-text-muted); line-height: 1.8;`;
const MapBtn = styled.a`display: inline-block; margin-top: 2rem; padding: 0.75rem 2rem; border: 1px solid var(--c-gold); color: var(--c-gold-dark); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: all 0.3s; &:hover { background: var(--c-gold); color: #fff; }`;
const DEFS = [{icon:'🚗',title:'Mit dem Auto',text:'Parkplätze stehen vor Ort zur Verfügung.'},{icon:'🚆',title:'Mit der Bahn',text:'Die nächste S-Bahn-Station ist 10 Min. entfernt.'},{icon:'🚕',title:'Taxi',text:'Wir organisieren einen Shuttle-Service.'}];
function Directions(){const{content}=useWedding();const d=content?.directions||{};const[ref,v]=useInView();const transport=d.transport||DEFS;return(<S id="directions" ref={ref}><Wrap><Hdr><Eye $v={v}>Anreise</Eye><Ttl $v={v}>{d.title||'Anfahrt'}</Ttl><Desc $v={v}>{d.description||'So findet ihr zu uns.'}</Desc></Hdr><Grid $v={v}>{transport.map((t,i)=>(<Card key={i}><Icon>{t.icon}</Icon><CTitle>{t.title||t.titel}</CTitle><CText>{t.text||t.beschreibung}</CText></Card>))}</Grid>{d.maps_url&&<div style={{textAlign:'center',marginTop:'2rem'}}><MapBtn href={d.maps_url} target="_blank" rel="noopener">Route anzeigen →</MapBtn></div>}</Wrap></S>);}
export default Directions;
