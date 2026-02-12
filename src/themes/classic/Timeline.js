import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); }`;
const lineGrow = keyframes`from { transform: scaleY(0); } to { transform: scaleY(1); }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); }`;
const lineExp = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const S = styled.section`padding: var(--section-pad) clamp(1.5rem, 5vw, 4rem); background: var(--c-cream);`;
const Wrap = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: clamp(4rem, 8vw, 6rem);`;
const Eye = styled.p`font-family: var(--font-body); font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.8s var(--ease) forwards; animation-delay: 0.15s;`}`;
const HLine = styled.div`width: 60px; height: 1px; background: var(--c-gold); margin: 1.5rem auto 0; transform: scaleX(0); ${p => p.$v && css`animation: ${lineExp} 0.6s var(--ease) forwards; animation-delay: 0.25s;`}`;

const TL = styled.div`position: relative; padding: 0 0 0 50px; @media(min-width:769px){ padding: 0; }`;
const VLine = styled.div`
  position: absolute; left: 8px; top: 0; bottom: 0; width: 1px;
  background: var(--c-sand); transform-origin: top; transform: scaleY(0);
  ${p => p.$v && css`animation: ${lineGrow} 1.5s var(--ease) forwards; animation-delay: 0.3s;`}
  @media(min-width:769px){ left: 50%; transform: translateX(-50%) scaleY(0);
    ${p => p.$v && css`animation: ${lineGrow} 1.5s var(--ease) forwards; animation-delay: 0.3s;`} }
`;
const Item = styled.div`
  position: relative; margin-bottom: 3rem;
  opacity: 0; ${p => p.$v && css`animation: ${fadeUp} 0.6s var(--ease) forwards; animation-delay: ${p.$d};`}
  @media(min-width:769px){
    width: 45%; text-align: ${p => p.$side === 'right' ? 'left' : 'right'};
    margin-left: ${p => p.$side === 'right' ? '55%' : '0'};
  }
`;
const Dot = styled.div`
  position: absolute; left: -46px; top: 4px; width: 12px; height: 12px;
  border-radius: 50%; border: 1px solid var(--c-gold); background: var(--c-cream);
  opacity: 0; ${p => p.$v && css`animation: ${scaleIn} 0.4s var(--ease) forwards; animation-delay: ${p.$d};`}
  @media(min-width:769px){ left: auto; ${p => p.$side === 'right' ? 'left: -32px;' : 'right: -32px;'} }
`;
const Time = styled.p`font-family: var(--font-body); font-size: 0.6rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-gold); margin-bottom: 0.3rem;`;
const ItemTitle = styled.h3`font-family: var(--font-display); font-size: 1.5rem; font-weight: 400; color: var(--c-text); margin-bottom: 0.5rem;`;
const ItemDesc = styled.p`font-size: 0.8rem; font-weight: 300; color: var(--c-text-muted); line-height: 1.8;`;

const DEFAULTS = [
  { time: '14:00', title: 'Empfang', description: 'Ankunft der Gäste mit Sektempfang im Garten' },
  { time: '15:00', title: 'Trauung', description: 'Die freie Trauung unter freiem Himmel' },
  { time: '16:30', title: 'Kaffee & Kuchen', description: 'Genießt Kaffee, Kuchen und die Hochzeitstorte' },
  { time: '18:30', title: 'Dinner', description: 'Festliches Abendessen im großen Saal' },
  { time: '21:00', title: 'Party', description: 'Eröffnungstanz und Party bis in die Nacht' },
];

function Timeline() {
  const { content } = useWedding();
  const tl = content?.timeline || {};
  const ref = useRef(null); const [v, setV] = useState(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  const items = tl.items?.length ? tl.items : DEFAULTS;
  return (
    <S id="timeline" ref={ref}>
      <Wrap>
        <Header><Eye $v={v}>Der große Tag</Eye><Title $v={v}>{tl.title || 'Tagesablauf'}</Title><HLine $v={v} /></Header>
        <TL><VLine $v={v} />
          {items.map((item, i) => (
            <Item key={i} $v={v} $d={`${0.4 + i * 0.12}s`} $side={i % 2 === 0 ? 'left' : 'right'}>
              <Dot $v={v} $d={`${0.4 + i * 0.12}s`} $side={i % 2 === 0 ? 'left' : 'right'} />
              <Time>{item.time || item.zeit}</Time>
              <ItemTitle>{item.title || item.titel}</ItemTitle>
              {(item.description || item.beschreibung) && <ItemDesc>{item.description || item.beschreibung}</ItemDesc>}
            </Item>
          ))}
        </TL>
      </Wrap>
    </S>
  );
}
export default Timeline;
