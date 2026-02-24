import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const DEF_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg';
const DEF_ACC = 'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg';

/* Full-bleed hero image at top of section */
const HeroImg = styled.div`
  position:relative;width:100vw;margin-left:50%;transform:translateX(-50%);
  height:55vh;min-height:350px;overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(25%) brightness(0.55);}
`;
const HeroOverlay = styled.div`
  position:absolute;bottom:0;left:0;right:0;padding:clamp(2rem,5vw,4rem);
  background:linear-gradient(transparent,rgba(0,0,0,0.5));
`;
const HeroEye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:0.5rem;`;
const HeroTitle = styled.h2`font-family:var(--font-d);font-size:clamp(2.5rem,5vw,4rem);font-weight:300;color:white;`;

/* Content area below hero - verschachtelt */
const Content = styled.div`
  max-width:var(--content-w,1200px);margin:-6rem auto 0;position:relative;z-index:2;
  padding:0 clamp(2rem,5vw,5rem);
`;

const LocCard = styled.div`
  display:grid;grid-template-columns:${p=>p.$rev?'1fr 0.7fr':'0.7fr 1fr'};gap:0;
  background:var(--c-white,#fff);box-shadow:0 20px 60px rgba(0,0,0,0.08);
  margin-bottom:3rem;overflow:hidden;
  @media(max-width:768px){grid-template-columns:1fr;}
`;
const LocImg = styled.div`
  position:relative;overflow:hidden;min-height:350px;
  ${p=>p.$rev?'order:2;':''}
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(15%);}
  @media(max-width:768px){min-height:280px;order:0;}
`;
const AccImg = styled.div`
  position:absolute;${p=>p.$rev?'top:-1.5rem;left:-1.5rem;':'bottom:-1.5rem;right:-1.5rem;'}
  width:45%;border:6px solid white;box-shadow:0 15px 40px rgba(0,0,0,0.12);z-index:3;overflow:hidden;
  img{width:100%;aspect-ratio:1;object-fit:cover;filter:none;}
  @media(max-width:768px){width:35%;${p=>p.$rev?'top:auto;bottom:-1rem;left:1rem;':'bottom:-1rem;right:1rem;'}}
`;
const LocText = styled.div`
  display:flex;flex-direction:column;justify-content:center;
  padding:clamp(2.5rem,4vw,4rem);${p=>p.$rev?'order:1;':''}
  @media(max-width:768px){order:1;padding:2.5rem 2rem;}
`;
const LocEye = styled.p`font-size:0.5rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--c-text-muted,#999);margin-bottom:1rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;`}`;
const LocName = styled.h3`font-family:var(--font-d);font-size:clamp(1.8rem,3vw,2.4rem);font-weight:300;margin-bottom:1rem;line-height:1.2;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.12s;`}`;
const LocP = styled.p`font-size:0.85rem;line-height:1.9;color:var(--c-text-sec,#555);max-width:400px;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.24s;`}`;
const LocAddr = styled.p`font-size:0.75rem;font-style:italic;color:var(--c-text-muted,#999);margin-top:0.75rem;
  opacity:0;${p=>p.$v&&css`animation:${fadeUp} 0.8s var(--ease) forwards;animation-delay:0.36s;`}`;

function LocationItem({ loc, index }) {
  const [ref, v] = useInView(0.08);
  const rev = index % 2 === 1;
  return (
    <LocCard ref={ref} $rev={rev}>
      <LocImg $rev={rev}>
        <img src={optimizedUrl.card(loc.image || DEF_IMG)} alt={loc.name} loading="lazy" />
        {loc.accent_image && <AccImg $rev={rev}><img src={optimizedUrl.card(loc.accent_image)} alt="" loading="lazy" /></AccImg>}
      </LocImg>
      <LocText $rev={rev}>
        {loc.label && <LocEye $v={v}>{loc.label}</LocEye>}
        <LocName $v={v}>{loc.name || loc.titel}</LocName>
        <LocP $v={v}>{loc.description || loc.beschreibung}</LocP>
        {(loc.address || loc.adresse) && <LocAddr $v={v}>{loc.address || loc.adresse}</LocAddr>}
      </LocText>
    </LocCard>
  );
}

function Locations() {
  const { content } = useWedding();
  const ld = content?.locations || {};
  const locs = ld.locations?.length ? ld.locations : [{
    label:'Trauung & Feier', name:'Schloss Charlottenburg',
    description:'Die Zeremonie und Feier finden im prachtvollen Ambiente des historischen Schlosses statt.',
    address:'Spandauer Damm 20, 14059 Berlin', image: DEF_IMG, accent_image: DEF_ACC
  }];
  const heroImg = locs[0]?.image || DEF_IMG;

  return (
    <section id="locations" style={{position:'relative',zIndex:2,paddingBottom:'clamp(4rem,8vh,8rem)',background:'var(--c-cream,#F5F0EB)'}}>
      <HeroImg>
        <img src={optimizedUrl.hero(heroImg)} alt="" loading="lazy" />
        <HeroOverlay>
          <HeroEye>Location</HeroEye>
          <HeroTitle>{ld.title || 'Unsere Location'}</HeroTitle>
        </HeroOverlay>
      </HeroImg>
      <Content>
        {locs.map((loc, i) => <LocationItem key={i} loc={loc} index={i} />)}
      </Content>
    </section>
  );
}
export default Locations;
