import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
const fadeUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
const Page = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--c-cream);padding:2rem;position:relative;overflow:hidden;`;
const BgImg = styled.div`position:absolute;inset:0;img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%) brightness(0.85);opacity:0.25;}`;
const Overlay = styled.div`position:absolute;inset:0;background:rgba(253,252,250,0.4);`;
const Card = styled.div`text-align:center;max-width:600px;position:relative;z-index:2;`;
const Eye = styled.p`font-family:var(--font-b);font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:2rem;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.3s;`;
const Names = styled.div`font-family:var(--font-d);font-size:clamp(3rem,8vw,5rem);font-weight:300;color:var(--c-text);line-height:1.1;opacity:0;animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.5s;`;
const ScriptAnd = styled.span`display:block;font-family:var(--font-s);font-size:clamp(2rem,5vw,3rem);color:var(--c-text-muted);margin:0.3em 0;opacity:0;animation:${fadeIn} 0.8s ease forwards;animation-delay:0.7s;`;
const Dt = styled.p`font-family:var(--font-d);font-size:clamp(1.2rem,3vw,1.6rem);font-style:italic;color:var(--c-text);margin-top:2rem;opacity:0;animation:${fadeUp} 0.8s ease forwards;animation-delay:1s;`;
const Loc = styled.p`font-family:var(--font-b);font-size:0.5rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--c-text-muted);margin-top:0.5rem;opacity:0;animation:${fadeUp} 0.8s ease forwards;animation-delay:1.2s;`;
const Msg = styled.p`font-family:var(--font-d);font-size:1rem;font-style:italic;color:var(--c-text-muted);margin-top:2rem;opacity:0;animation:${fadeUp} 0.8s ease forwards;animation-delay:1.4s;`;
function SaveTheDate(){const{project,content,weddingDate}=useWedding();const s=content?.savethedate||{};const n1=project?.partner1_name||'Anna';const n2=project?.partner2_name||'Max';const loc=project?.location||'';const fmt=d=>d?new Date(d).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):'';
const hasBg=!!s.hero_image;
return(<Page>{hasBg&&<BgImg><img src={s.hero_image} alt="" loading="eager"/></BgImg>}{hasBg&&<Overlay/>}<Card><Eye>{s.tagline||'Save the Date'}</Eye><Names>{n1}<ScriptAnd>&</ScriptAnd>{n2}</Names><Dt>{fmt(weddingDate)}</Dt>{loc&&<Loc>{loc}</Loc>}<Msg>{s.message||'Einladung folgt'}</Msg></Card></Page>);}
export default SaveTheDate;
