import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { useGifts } from '../../components/shared/GiftsCore';
import FeedbackModal from '../../components/shared/FeedbackModal';

const fadeInUp = keyframes`from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); }`;
const Section = styled.section`padding: var(--section-padding) clamp(1.5rem, 5vw, 4rem); background: var(--classic-cream);`;
const Container = styled.div`max-width: 800px; margin: 0 auto;`;
const Header = styled.div`text-align: center; margin-bottom: 3rem;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1rem; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards;`}`;
const Title = styled.h2`font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.15s;`}`;
const Desc = styled.p`font-size: 0.9rem; font-weight: 300; color: var(--classic-text-light); margin-top: 1rem; max-width: 550px; margin-left: auto; margin-right: auto; opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.8s ease forwards; animation-delay: 0.25s;`}`;
const GiftCard = styled.div`background: var(--classic-white); padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 2px 15px rgba(0,0,0,0.04); opacity: 0; ${p => p.$v && css`animation: ${fadeInUp} 0.6s ease forwards; animation-delay: ${p.$delay};`}`;
const GiftTitle = styled.h3`font-family: var(--font-display); font-size: 1.4rem; font-weight: 400; margin-bottom: 0.5rem;`;
const GiftText = styled.p`font-size: 0.85rem; font-weight: 300; color: var(--classic-text-light); line-height: 1.7;`;
const GiftAmount = styled.p`font-family: var(--font-display); font-size: 1.5rem; font-weight: 300; color: var(--classic-gold); margin-top: 0.75rem;`;
const ProgressBar = styled.div`height: 3px; background: var(--classic-beige); margin-top: 1rem; overflow: hidden; &::after { content: ''; display: block; height: 100%; width: ${p => p.$pct}%; background: var(--classic-gold); transition: width 1s; }`;
const ReserveBtn = styled.button`margin-top: 1rem; padding: 0.75rem 2rem; background: transparent; border: 1px solid var(--classic-gold); color: var(--classic-gold-dark); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s; &:hover { background: var(--classic-gold); color: #fff; } &:disabled { opacity: 0.4; }`;

function Gifts() {
  const { content } = useWedding();
  const giftsData = content?.gifts || {};
  const { gifts, reserveGift, feedback, closeFeedback } = useGifts();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const title = giftsData.title || 'Geschenke';
  const description = giftsData.description || 'Das größte Geschenk ist eure Anwesenheit.';
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  const giftItems = gifts?.length ? gifts : giftsData.items || [];
  return (
    <Section id="gifts" ref={ref}>
      <Container>
        <Header><Eyebrow $v={visible}>Wünsche</Eyebrow><Title $v={visible}>{title}</Title><Desc $v={visible}>{description}</Desc></Header>
        {giftItems.map((gift, i) => {
          const pct = gift.target_amount ? Math.min(100, ((gift.reserved_amount || 0) / gift.target_amount) * 100) : 0;
          return (<GiftCard key={gift.id || i} $v={visible} $delay={`${0.3 + i * 0.1}s`}><GiftTitle>{gift.title || gift.name}</GiftTitle><GiftText>{gift.description}</GiftText>{gift.target_amount && <><GiftAmount>{gift.target_amount} €</GiftAmount><ProgressBar $pct={pct} /></>}<ReserveBtn onClick={() => reserveGift(gift.id)} disabled={pct >= 100}>{pct >= 100 ? 'Reserviert' : 'Reservieren'}</ReserveBtn></GiftCard>);
        })}
      </Container>
      <FeedbackModal {...feedback} onClose={closeFeedback} />
    </Section>
  );
}
export default Gifts;
