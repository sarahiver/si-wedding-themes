import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const lineGrow = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const Page = styled.div`min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--classic-cream); padding: 2rem;`;
const Card = styled.div`text-align: center; max-width: 600px;`;
const Eyebrow = styled.p`font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--classic-gold); margin-bottom: 1.5rem; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.3s;`;
const Names = styled.h1`font-family: var(--font-display); font-size: clamp(3rem, 8vw, 5rem); font-weight: 300; color: var(--classic-charcoal); line-height: 1.1; margin-bottom: 0.5rem; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 0.5s;`;
const ScriptAnd = styled.span`display: block; font-family: var(--font-script); font-size: clamp(2rem, 5vw, 3rem); color: var(--classic-gold); margin: 0.3em 0; opacity: 0; animation: ${fadeIn} 0.8s ease forwards; animation-delay: 0.7s;`;
const Line = styled.div`width: 60px; height: 1px; background: var(--classic-gold); margin: 2rem auto; transform: scaleX(0); animation: ${lineGrow} 0.6s ease forwards; animation-delay: 1s;`;
const DateText = styled.p`font-family: var(--font-display); font-size: clamp(1.2rem, 3vw, 1.6rem); font-style: italic; color: var(--classic-charcoal); opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 1.2s;`;
const Location = styled.p`font-family: var(--font-body); font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--classic-text-light); margin-top: 0.5rem; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 1.4s;`;
const Message = styled.p`font-family: var(--font-display); font-size: 1rem; font-style: italic; color: var(--classic-text-light); margin-top: 2rem; max-width: 400px; margin-left: auto; margin-right: auto; opacity: 0; animation: ${fadeUp} 0.8s ease forwards; animation-delay: 1.6s;`;

function SaveTheDate() {
  const { project, content, weddingDate } = useWedding();
  const std = content?.savethedate || {};
  const name1 = project?.partner1_name || 'Anna';
  const name2 = project?.partner2_name || 'Max';
  const location = project?.location || '';
  const message = std.message || 'Einladung folgt';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <Page>
      <Card>
        <Eyebrow>{std.tagline || 'Save the Date'}</Eyebrow>
        <Names>{name1}<ScriptAnd>&</ScriptAnd>{name2}</Names>
        <Line />
        <DateText>{formatDate(weddingDate)}</DateText>
        {location && <Location>{location}</Location>}
        <Message>{message}</Message>
      </Card>
    </Page>
  );
}

export default SaveTheDate;
