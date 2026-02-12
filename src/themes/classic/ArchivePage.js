import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;

const Page = styled.div`min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--classic-cream); padding: 2rem;`;
const Card = styled.div`text-align: center; max-width: 600px;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1.5rem; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.3s;`;
const Title = styled.h1`font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 300; color: var(--classic-charcoal); opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.5s;`;
const Message = styled.p`font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--classic-text-light); margin-top: 1.5rem; max-width: 450px; margin-left: auto; margin-right: auto; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.7s;`;

function ArchivePage() {
  const { content, project } = useWedding();
  const archive = content?.archive || {};
  const coupleNames = project?.couple_names || 'Anna & Max';
  const title = archive.thank_you_title || 'Danke!';
  const message = archive.thank_you_text || `Danke, dass ihr unseren besonderen Tag mit uns gefeiert habt!`;
  return (
    <Page><Card><Eyebrow>{coupleNames}</Eyebrow><Title>{title}</Title><Message>{message}</Message></Card></Page>
  );
}

export default ArchivePage;
