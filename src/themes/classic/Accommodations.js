import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-cream);`;
const Wrap = styled.div`max-width: var(--content-w); margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);`;

const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;`;
const Card = styled.div`overflow: hidden; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: ${p.$d};`}`;
const CImg = styled.div`overflow: hidden; img { width: 100%; aspect-ratio: 4/5; object-fit: cover; filter: grayscale(15%); transition: all 0.6s; } &:hover img { filter: grayscale(0%); transform: scale(1.03); }`;
const CBody = styled.div`background: var(--c-white); padding: 2rem; box-shadow: 0 15px 40px rgba(0,0,0,0.05); margin-top: calc(var(--overlap-mobile) * -1); position: relative; z-index: 2; margin-left: 1rem; margin-right: 1rem;`;
const CTitle = styled.h3`font-family: var(--font-display); font-size: 1.4rem; font-weight: 400; margin-bottom: 0.5rem;`;
const CText = styled.p`font-size: 0.8rem; font-weight: 300; color: var(--c-text-sec); line-height: 1.8;`;
const CPrice = styled.p`font-family: var(--font-display); font-size: 1.1rem; color: var(--c-gold); margin-top: 0.5rem;`;
const CLink = styled.a`display: inline-block; margin-top: 0.75rem; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--c-gold-dark); border-bottom: 1px solid var(--c-gold); padding-bottom: 2px;`;
const DEFS=[{name:'Hotel Gartenblick',description:'Charmantes Boutique-Hotel am Veranstaltungsort.',price:'ab 120 € / Nacht',image:'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg'},{name:'Landhaus am See',description:'Ruhige Lage mit Seeblick, 5 Min. entfernt.',price:'ab 95 € / Nacht',image:'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg'}];
function Accommodations(){const{content}=useWedding();const a=content?.accommodations||{};const[ref,v]=useInView();const hotels=a.hotels?.length?a.hotels:DEFS;return(<S id="accommodations" ref={ref}><Wrap><Hdr><Eye $v={v}>Übernachten</Eye><Ttl $v={v}>{a.title||'Unterkünfte'}</Ttl><Desc $v={v}>{a.description||'Hier könnt ihr übernachten.'}</Desc></Hdr><Grid>{hotels.map((h,i)=>(<Card key={i} $v={v} $d={`${0.3+i*0.15}s`}><CImg><img src={h.image||DEFS[0].image} alt={h.name} loading="lazy"/></CImg><CBody><CTitle>{h.name||h.titel}</CTitle><CText>{h.description||h.beschreibung}</CText>{h.price&&<CPrice>{h.price}</CPrice>}{h.url&&<CLink href={h.url} target="_blank" rel="noopener">Website →</CLink>}</CBody></Card>))}</Grid></Wrap></S>);}
export default Accommodations;
