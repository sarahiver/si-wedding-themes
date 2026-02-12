import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-cream);`;
const Wrap = styled.div`max-width: 800px; margin: 0 auto;`;
const Hdr = styled.div`text-align: center; margin-bottom: clamp(3rem, 6vw, 5rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Ttl = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.85rem; font-weight: 300; color: var(--c-text-sec); margin-top: 1rem; max-width: var(--text-w); margin-left: auto; margin-right: auto; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.25s;`}`;
const Card = styled.div`background: var(--c-white); padding: 2.5rem; margin-bottom: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.04); opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.6s var(--ease) forwards; animation-delay: ${p.$d};`}`;
const GTitle = styled.h3`font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; margin-bottom: 0.5rem;`;
const GText = styled.p`font-size: 0.8rem; font-weight: 300; color: var(--c-text-sec); line-height: 1.8;`;
const GAmt = styled.p`font-family: var(--font-display); font-size: 1.8rem; font-weight: 300; color: var(--c-gold); margin-top: 1rem;`;
const PBar = styled.div`height: 2px; background: var(--c-sand); margin-top: 1rem; overflow: hidden; &::after { content: ''; display: block; height: 100%; width: ${p => p.$p}%; background: var(--c-gold); transition: width 1s; }`;
const RBtn = styled.button`margin-top: 1rem; padding: 0.75rem 2rem; background: transparent; border: 1px solid var(--c-gold); color: var(--c-gold-dark); font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s; &:hover { background: var(--c-gold); color: #fff; } &:disabled { opacity: 0.3; }`;

function Gifts(){const{content}=useWedding();const g=content?.gifts||{};const{gifts,reserveGift,feedback,closeFeedback}=useGifts();const ref=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:0.1});if(ref.current)o.observe(ref.current);return()=>o.disconnect();},[]);const items=gifts?.length?gifts:g.items||[];
return(<S id="gifts" ref={ref}><Wrap><Hdr><Eye $v={v}>Wünsche</Eye><Ttl $v={v}>{g.title||'Geschenke'}</Ttl><Desc $v={v}>{g.description||'Das größte Geschenk ist eure Anwesenheit.'}</Desc></Hdr>{items.map((gift,i)=>{const p=gift.target_amount?Math.min(100,((gift.reserved_amount||0)/gift.target_amount)*100):0;return(<Card key={gift.id||i} $v={v} $d={`${0.3+i*0.1}s`}><GTitle>{gift.title||gift.name}</GTitle><GText>{gift.description}</GText>{gift.target_amount&&<><GAmt>{gift.target_amount} €</GAmt><PBar $p={p}/></>}<RBtn onClick={()=>reserveGift(gift.id)} disabled={p>=100}>{p>=100?'Reserviert':'Reservieren'}</RBtn></Card>);})}</Wrap><FeedbackModal {...feedback} onClose={closeFeedback}/></S>);}
export default Gifts;
