import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
function useInView(th=0.08){const r=useRef(null);const[v,setV]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];}

const S = styled.section`padding:var(--section-pad) clamp(2rem,5vw,5rem);background:var(--c-white);position:relative;z-index:2;`;
const Hdr = styled.div`text-align:center;margin-bottom:clamp(3rem,5vw,4rem);`;
const Eye = styled.p`font-family:var(--font-s);font-size:clamp(1.4rem,2.5vw,1.8rem);color:var(--c-accent);margin-bottom:0.5rem;`;
const Title = styled.h2`font-family:var(--font-d);font-size:clamp(2rem,4vw,3rem);font-weight:300;margin-bottom:0.75rem;`;
const Desc = styled.p`font-size:0.85rem;line-height:1.9;color:var(--c-text-sec);max-width:550px;margin:0 auto;`;

const Grid = styled.div`max-width:var(--content-w);margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:clamp(3rem,5vw,5rem);align-items:start;
  @media(max-width:768px){grid-template-columns:1fr;}`;

/* Links: Geschenk-Bilder stapeln sich */
const ImgStack = styled.div`position:relative;min-height:480px;
  @media(max-width:768px){min-height:350px;}`;

/* Stagger positions for editorial overlap */
const stackPositions = [
  { top: '0%',  left: '0%',  width: '65%', ratio: '3/4' },
  { top: '10%', left: '35%', width: '55%', ratio: '4/5' },
  { top: '5%',  left: '15%', width: '60%', ratio: '1/1' },
  { top: '15%', left: '5%',  width: '50%', ratio: '4/5' },
  { top: '8%',  left: '30%', width: '58%', ratio: '3/4' },
];

const GiftImg = styled.div`
  position:absolute;overflow:hidden;
  border:6px solid white;box-shadow:0 12px 35px rgba(0,0,0,0.08);
  cursor:pointer;
  transition:all 0.6s var(--ease);
  z-index:${p => p.$active ? 10 : p.$idx || 1};
  opacity:${p => p.$active ? 1 : 0.55};
  transform:${p => p.$active ? 'scale(1.02) translateY(-4px)' : 'scale(0.94)'};
  img{width:100%;aspect-ratio:${p => p.$ratio || '4/3'};object-fit:cover;
    filter:${p => p.$reserved ? 'grayscale(100%) brightness(0.6)' : p.$active ? 'grayscale(0%)' : 'grayscale(100%)'};
    transition:filter 0.6s;}
  ${p => p.$active && css`box-shadow:0 20px 50px rgba(0,0,0,0.14);`}
  &:hover img{filter:${p => p.$reserved ? 'grayscale(100%) brightness(0.6)' : 'grayscale(0%)'};}
`;

/* Rechts: Geschenke-Liste */
const GiftCard = styled.div`padding:1.5rem 0;border-bottom:1px solid var(--c-border,rgba(0,0,0,0.06));
  display:flex;justify-content:space-between;align-items:center;gap:1.5rem;
  cursor:pointer;transition:all 0.3s;
  opacity:${p => p.$reserved ? 0.4 : p.$active ? 1 : 0.65};
  background:${p => p.$active ? 'rgba(0,0,0,0.015)' : 'transparent'};
  margin:0 -0.5rem;padding-left:0.5rem;padding-right:0.5rem;
  &:hover{opacity:${p => p.$reserved ? 0.4 : 1};}
  @media(max-width:500px){flex-direction:column;align-items:flex-start;}`;
const GInfo = styled.div`flex:1;`;
const GN = styled.h3`font-family:var(--font-d);font-size:1.2rem;font-weight:400;margin-bottom:0.25rem;`;
const GT = styled.p`font-size:0.8rem;color:var(--c-text-sec);line-height:1.6;`;
const GA = styled.p`font-family:var(--font-d);font-size:1.05rem;color:var(--c-text-muted);margin-top:0.3rem;`;
const RB = styled.button`padding:0.6rem 1.8rem;background:transparent;
  border:1px solid ${p => p.$done ? 'var(--c-border,rgba(0,0,0,0.06))' : 'var(--c-dark,#1A1A1A)'};
  color:${p => p.$done ? 'var(--c-text-muted)' : 'var(--c-dark)'};
  font-size:0.5rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;flex-shrink:0;
  &:hover{background:${p => p.$done ? 'transparent' : 'var(--c-dark)'};color:${p => p.$done ? 'var(--c-text-muted)' : 'white'};}&:disabled{opacity:0.3;cursor:default;}`;

const ReservedTag = styled.span`font-family:var(--font-b);font-size:0.5rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--c-text-muted);`;

const DEMO_IMG = 'https://res.cloudinary.com/si-weddings/image/upload/v1770829488/siwedding/demo-botanical/photos/hr2mofharqklzu8yptxi.jpg';

const DEF_GIFTS = [
  { id: 'g1', title: 'Hochzeitsreise', description: 'Ein Beitrag zu unserem Flitterwochen-Abenteuer.', target_amount: 500 },
  { id: 'g2', title: 'Küchenausstattung', description: 'Für unsere erste gemeinsame Küche.', target_amount: 200 },
  { id: 'g3', title: 'Gartengestaltung', description: 'Pflanzen und Deko für unseren Garten.' },
];

function Gifts() {
  const { content } = useWedding(); const g = content?.gifts || {};
  const { items: coreItems, isItemReserved, reserveGiftItem } = useGifts();
  const [ref, v] = useInView();
  const [activeIdx, setActiveIdx] = useState(0);

  const giftItems = (coreItems && coreItems.length > 0) ? coreItems
    : (g.items && g.items.length > 0) ? g.items
    : DEF_GIFTS;

  // Items with images for the stack (fallback to all if none have images)
  const itemsWithImages = giftItems.filter(item => item.image);
  const stackItems = itemsWithImages.length > 0 ? itemsWithImages : giftItems;

  return (
    <S id="gifts" data-theme-light ref={ref}>
      <Hdr>
        <Eye>Wünsche</Eye>
        <Title>{g.title || 'Geschenkideen'}</Title>
        <Desc>{g.description || 'Das größte Geschenk ist eure Anwesenheit. Wer uns dennoch etwas schenken möchte, findet hier einige Ideen.'}</Desc>
      </Hdr>
      <Grid>
        <ImgStack>
          {stackItems.map((gift, i) => {
            const pos = stackPositions[i % stackPositions.length];
            const reserved = isItemReserved ? isItemReserved(gift.id) : false;
            const isActive = i === activeIdx;
            return (
              <GiftImg
                key={gift.id || i}
                $active={isActive}
                $reserved={reserved}
                $idx={isActive ? 10 : i + 1}
                $ratio={pos.ratio}
                style={{ top: pos.top, left: pos.left, width: pos.width }}
                onClick={() => setActiveIdx(i)}
              >
                <img src={gift.image || DEMO_IMG} alt={gift.title || ''} loading="lazy" />
              </GiftImg>
            );
          })}
        </ImgStack>
        <div>
          {giftItems.map((gift, i) => {
            const reserved = isItemReserved ? isItemReserved(gift.id) : false;
            const stackIdx = stackItems.findIndex(si => si.id === gift.id);
            const isActive = stackIdx >= 0 && stackIdx === activeIdx;
            return (
              <GiftCard
                key={gift.id || i}
                $reserved={reserved}
                $active={isActive}
                onClick={() => { if (stackIdx >= 0) setActiveIdx(stackIdx); }}
              >
                <GInfo>
                  <GN>{gift.title || gift.name || 'Geschenk'}</GN>
                  {gift.description && <GT>{gift.description}</GT>}
                  {gift.target_amount && <GA>{gift.target_amount} €</GA>}
                </GInfo>
                <RB
                  $done={reserved}
                  onClick={(e) => { e.stopPropagation(); reserveGiftItem && reserveGiftItem(gift.id); }}
                  disabled={reserved}
                >
                  {reserved ? 'Reserviert' : 'Reservieren'}
                </RB>
              </GiftCard>
            );
          })}
        </div>
      </Grid>
    </S>
  );
}
export default Gifts;
