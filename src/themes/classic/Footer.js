import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const Ft = styled.footer`background:var(--c-cream);display:grid;grid-template-columns:1fr 1fr;min-height:50vh;@media(max-width:900px){grid-template-columns:1fr;}`;
const Img = styled.div`overflow:hidden;@media(max-width:900px){height:40vh;} img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) brightness(0.7);}`;
const Txt = styled.div`display:flex;flex-direction:column;justify-content:center;padding:clamp(3rem,6vw,5rem);`;
const Script = styled.div`font-family:var(--font-s);font-size:clamp(2.5rem,5vw,3.5rem);color:var(--c-text-muted);margin-bottom:1rem;`;
const Dt = styled.p`font-family:var(--font-d);font-size:1rem;font-style:italic;color:var(--c-text-muted);margin-bottom:2rem;`;
const Line = styled.div`width:35px;height:1px;background:rgba(0,0,0,0.15);margin-bottom:1.5rem;`;
const Hash = styled.p`font-size:0.6rem;letter-spacing:0.15em;color:rgba(0,0,0,0.2);margin-bottom:3rem;`;
const Brand = styled.p`font-size:0.45rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,0,0,0.1); a{color:rgba(0,0,0,0.15);text-decoration:none;} a:hover{color:var(--c-text-muted);}`;
const DEF_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';
function Footer(){const{project,content,weddingDate}=useWedding();const cn=project?.couple_names||'Anna & Max';const ht=project?.hashtag||content?.footer?.hashtag;const img=content?.footer?.image||DEF_IMG;const fmt=d=>d?new Date(d).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):'';
return(<Ft><Img><img src={img} alt="" loading="lazy"/></Img><Txt><Script>{cn}</Script>{weddingDate&&<Dt>{fmt(weddingDate)}</Dt>}<Line/>{ht&&<Hash>#{ht}</Hash>}<Brand>Made with love by <a href="https://sarahiver.com" target="_blank" rel="noopener noreferrer">S&I.</a></Brand></Txt></Ft>);}
export default Footer;
