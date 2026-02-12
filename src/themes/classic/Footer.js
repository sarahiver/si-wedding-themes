import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const Ft = styled.footer`padding: clamp(4rem, 8vh, 6rem) clamp(1.5rem, 5vw, 4rem) 2rem; background: var(--c-dark); text-align: center;`;
const Names = styled.h2`font-family: var(--font-script); font-size: clamp(2rem, 5vw, 3rem); color: var(--c-gold); margin-bottom: 1rem;`;
const DateTxt = styled.p`font-family: var(--font-display); font-size: 1rem; font-style: italic; color: rgba(255,255,255,0.4); margin-bottom: 2rem;`;
const Div = styled.div`width: 40px; height: 1px; background: var(--c-gold); margin: 0 auto 2rem; opacity: 0.4;`;
const Hash = styled.p`font-family: var(--font-body); font-size: 0.7rem; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; margin-bottom: 2rem;`;
const Brand = styled.p`font-size: 0.55rem; color: rgba(255,255,255,0.15); letter-spacing: 0.15em; text-transform: uppercase; a { color: rgba(255,255,255,0.2); text-decoration: none; &:hover { color: var(--c-gold); } }`;

function Footer(){const{project,content,weddingDate}=useWedding();const cn=project?.couple_names||'Anna & Max';const ht=project?.hashtag||content?.footer?.hashtag;const fmt=d=>d?new Date(d).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):'';
return(<Ft><Names>{cn}</Names>{weddingDate&&<DateTxt>{fmt(weddingDate)}</DateTxt>}<Div/>{ht&&<Hash>#{ht}</Hash>}<Brand>Made with love by <a href="https://sarahiver.com" target="_blank" rel="noopener noreferrer">S&I.</a></Brand></Ft>);}
export default Footer;
