import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const scaleIn = keyframes`from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); }`;
const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-white);`;
const Wrap = styled.div`max-width: 700px; margin: 0 auto; text-align: center;`;

const DText = styled.p`font-family: var(--font-display); font-size: 1.3rem; font-style: italic; font-weight: 300; color: var(--c-text); line-height: 1.9; margin-top: 2rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.3s;`}`;
const Colors = styled.div`display: flex; justify-content: center; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap;`;
const Swatch = styled.div`width: 45px; height: 45px; border-radius: 50%; background: ${p => p.$c}; box-shadow: 0 4px 12px rgba(0,0,0,0.1); opacity: 0; ${p => p.$v && css`animation: ${scaleIn} 0.4s var(--ease) forwards; animation-delay: ${p.$d};`}`;
function Dresscode(){const{content}=useWedding();const d=content?.dresscode||{};const[ref,v]=useInView();const colors=d.colors||['#2C2C2C','#F5F0EB','#C4A87C','#8B7355','#D4C5B5'];return(<S id="dresscode" ref={ref}><Wrap><Eye $v={v}>Kleiderordnung</Eye><Ttl $v={v}>{d.title||'Dresscode'}</Ttl><DText $v={v}>{d.description||'Wir freuen uns über elegante Garderobe in gedeckten, warmen Farben.'}</DText><Colors>{colors.map((c,i)=>(<Swatch key={i} $c={c} $v={v} $d={`${0.5+i*0.08}s`}/>))}</Colors></Wrap></S>);}
export default Dresscode;
