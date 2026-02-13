import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const Page = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--c-cream);padding:2rem;`;
const Card = styled.div`text-align:center;max-width:600px;`;
const Eye = styled.p`font-family:var(--font-b);font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1.5rem;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.3s;`;
const Title = styled.h1`font-family:var(--font-d);font-size:clamp(2.5rem,6vw,4rem);font-weight:300;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.5s;`;
const Msg = styled.p`font-family:var(--font-d);font-size:1.1rem;font-style:italic;color:var(--c-text-muted);margin-top:1.5rem;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.7s;`;
const GalleryGrid = styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;max-width:900px;margin:3rem auto 0;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.9s;
  @media(max-width:600px){grid-template-columns:repeat(2,1fr);}`;
const GalleryImg = styled.img`width:100%;aspect-ratio:1;object-fit:cover;filter:grayscale(20%);transition:filter 0.3s;&:hover{filter:grayscale(0);}`;
function ArchivePage(){const{content,project}=useWedding();const a=content?.archive||{};const cn=project?.couple_names||'Anna & Max';
return(<Page style={a.gallery_images?.length?{flexDirection:'column',alignItems:'center'}:undefined}><Card><Eye>{cn}</Eye><Title>{a.thank_you_title||'Danke!'}</Title><Msg>{a.thank_you_text||'Danke, dass ihr unseren besonderen Tag mit uns gefeiert habt!'}</Msg></Card>{a.gallery_images?.length>0&&<GalleryGrid>{a.gallery_images.map((img,i)=><GalleryImg key={i} src={typeof img==='string'?img:img.url} alt="" loading="lazy"/>)}</GalleryGrid>}</Page>);}
export default ArchivePage;
