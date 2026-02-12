import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const Section = styled.section`
  padding: clamp(5rem,12vh,10rem) clamp(2rem,6vw,6rem);
  background: var(--c-cream); position: relative; z-index: 2;
`;
const Inner = styled.div`max-width: 1100px; margin: 0 auto;`;
const Hdr = styled.div`
  text-align: center; margin-bottom: clamp(4rem,8vw,7rem);
  opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.8s var(--ease) forwards;`}
`;
const Eye = styled.p`font-size:0.45rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const STitle = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;margin-bottom:0.5rem;`;
const Script = styled.span`font-family:var(--font-s);font-size:clamp(1.8rem,3vw,2.5rem);color:var(--c-text-muted);`;
const Sub = styled.p`font-family:var(--font-d);font-size:1rem;font-style:italic;color:var(--c-text-sec);margin-top:0.5rem;`;

/* Each story block: text + image cluster, alternating */
const Block = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  gap: clamp(3rem,6vw,5rem); align-items: center;
  margin-bottom: clamp(5rem,10vh,8rem);
  ${p => p.$rev && css`direction:rtl;`}
  & > * { direction:ltr; }
  @media(max-width:900px){ grid-template-columns:1fr; direction:ltr; }
  &:last-child { margin-bottom: 0; }
`;

const TextSide = styled.div`
  max-width: 400px;
  ${p => p.$rev && css`justify-self:end;`}
  opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.8s var(--ease) forwards; animation-delay:0.12s;`}
`;

const Year = styled.p`
  font-family: var(--font-d); font-size: 2.5rem; font-weight: 300;
  color: rgba(0,0,0,0.06); line-height: 1; margin-bottom: 0.5rem;
`;
const BTitle = styled.h3`font-family:var(--font-d);font-size:clamp(1.5rem,3vw,2rem);font-weight:300;margin-bottom:1rem;`;
const BText = styled.p`font-size:0.82rem;line-height:2;color:var(--c-text-sec);`;

const ImageCluster = styled.div`
  position: relative; opacity:0;
  ${p => p.$v && css`animation:${fadeUp} 0.8s var(--ease) forwards; animation-delay:0.24s;`}
`;
const MainImg = styled.img`
  width: 80%; aspect-ratio: 4/5; object-fit: cover;
  filter: grayscale(100%);
  ${p => p.$rev && css`margin-left:auto;display:block;`}
`;
const AccImg = styled.img`
  position: absolute; width: 50%; aspect-ratio: 3/4;
  object-fit: cover; border: 6px solid white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  z-index: 2;
  /* front image is in color */
  filter: none;
  ${p => p.$rev ? css`bottom:-1.5rem;left:0;` : css`bottom:-1.5rem;right:0;`}
`;

const DEFAULT_STORIES = [
  { year:'2019', title:'Wo alles begann', text:'Es war ein ganz normaler Tag, als wir uns zum ersten Mal begegnet sind. Was als zufälliges Treffen begann, entwickelte sich schnell zu etwas Besonderem.', image:'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/hr2mofharqklzu8yptxi.jpg', accent_image:'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/rg54tyya7phb75yg6dsk.jpg' },
  { year:'2021', title:'Unser Abenteuer', text:'Zusammen haben wir die Welt entdeckt. Jede Reise, jeder gemeinsame Moment hat uns näher zusammengebracht.', image:'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/uj61pv6uqigwyh5pidvi.jpg', accent_image:'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/gxmqpkk0ksnveevic9fp.jpg' },
  { year:'2025', title:'Die große Frage', text:'An einem magischen Abend stellte sich die Frage aller Fragen – und die Antwort war ein überglückliches Ja!', image:'https://res.cloudinary.com/si-weddings/image/upload/v1770723589/siwedding/demo-botanical/gallery/cxlyozhisgrvupguqsa6.jpg', accent_image:'https://res.cloudinary.com/si-weddings/image/upload/v1770720374/siwedding/demo-botanical/hotels/jzbjzmnwiisapct8yevz.jpg' },
];

function StoryBlock({ story, index }) {
  const [ref, v] = useInView(0.08);
  const rev = index % 2 === 1;
  return (
    <Block ref={ref} $rev={rev}>
      <TextSide $v={v} $rev={rev}>
        <Year>{story.year}</Year>
        <BTitle>{story.title}</BTitle>
        <BText>{story.text}</BText>
      </TextSide>
      <ImageCluster $v={v}>
        <MainImg src={story.image} alt={story.title} loading="lazy" $rev={rev} />
        {story.accent_image && <AccImg src={story.accent_image} alt="" loading="lazy" $rev={rev} />}
      </ImageCluster>
    </Block>
  );
}

function LoveStory() {
  const { content } = useWedding();
  const ls = content?.lovestory || {};
  const [hRef, hV] = useInView();
  const title = ls.title || 'Unsere Geschichte';
  const subtitle = ls.subtitle || 'Wie alles begann';
  const stories = ls.stories?.length ? ls.stories : DEFAULT_STORIES;

  return (
    <Section id="lovestory">
      <Inner>
        <Hdr ref={hRef} $v={hV}>
          <Eye>Über uns</Eye>
          <STitle>{title}</STitle>
          <Script>{subtitle}</Script>
        </Hdr>
        {stories.map((story, i) => <StoryBlock key={i} story={story} index={i} />)}
      </Inner>
    </Section>
  );
}
export default LoveStory;
