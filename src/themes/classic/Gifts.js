import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}
const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-cream);position:relative;z-index:2;`;
const Wrap = styled.div`max-width:800px;margin:0 auto;`;
const Hdr = styled.div`text-align:center;margin-bottom:3rem;`;
const Eye = styled.p`font-size:0.5rem;letter-spacing:0.35em;text-transform:uppercase;color:var(--c-text-muted);margin-bottom:1rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;`;
const Desc = styled.p`font-size:0.85rem;font-weight:300;color:var(--c-text-sec);margin-top:1rem;max-width:500px;margin-left:auto;margin-right:auto;`;
const Card = styled.div`background:var(--c-white);padding:2rem;margin-bottom:1.5rem;box-shadow:0 2px 15px rgba(0,0,0,0.03);`;
const GN = styled.h3`font-family:var(--font-d);font-size:1.4rem;font-weight:400;margin-bottom:0.5rem;`;
const GT = styled.p`font-size:0.82rem;font-weight:300;color:var(--c-text-sec);line-height:1.8;`;
const GA = styled.p`font-family:var(--font-d);font-size:1.3rem;font-weight:300;color:var(--c-accent);margin-top:0.75rem;`;
const PB = styled.div`height:3px;background:var(--c-border);margin-top:0.75rem;overflow:hidden;&::after{content:'';display:block;height:100%;width:${p=>p.$p||0}%;background:var(--c-text-muted);transition:width 1s;}`;
const RB = styled.button`margin-top:1rem;padding:0.75rem 2rem;background:transparent;border:1px solid var(--c-text-muted);color:var(--c-text);font-size:0.55rem;letter-spacing:0.15em;text-transform:uppercase;transition:all 0.3s;&:hover{background:var(--c-dark);color:white;border-color:var(--c-dark);}&:disabled{opacity:0.3;}`;

function Gifts() {
  const { content } = useWedding();
  const g = content?.gifts || {};
  const { items, isItemReserved, reserveGiftItem } = useGifts();
  const [ref, v] = useInView();

  const giftItems = items?.length ? items : g.items || [];

  return (
    <S id="gifts" ref={ref}>
      <Wrap>
        <Hdr>
          <Eye>Wünsche</Eye>
          <Title>{g.title || 'Geschenke'}</Title>
          <Desc>{g.description || 'Das größte Geschenk ist eure Anwesenheit.'}</Desc>
        </Hdr>
        {giftItems.map((gift, i) => {
          const reserved = isItemReserved ? isItemReserved(gift.id) : false;
          const pct = gift.target_amount ? Math.min(100, ((gift.reserved_amount || 0) / gift.target_amount) * 100) : 0;
          return (
            <Card key={gift.id || i}>
              <GN>{gift.title || gift.name || 'Geschenk'}</GN>
              {gift.description && <GT>{gift.description}</GT>}
              {gift.target_amount && (
                <>
                  <GA>{gift.target_amount} €</GA>
                  <PB $p={pct} />
                </>
              )}
              <RB onClick={() => reserveGiftItem && reserveGiftItem(gift.id)} disabled={reserved || pct >= 100}>
                {reserved || pct >= 100 ? 'Reserviert' : 'Reservieren'}
              </RB>
            </Card>
          );
        })}
      </Wrap>
    </S>
  );
}
export default Gifts;
