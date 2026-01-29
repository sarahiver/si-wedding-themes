// GiftsContent
import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../../context/WeddingContext';

const Wrapper = styled.div`text-align: center;`;
const Eyebrow = styled.p`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--light); margin-bottom: 0.5rem;`;
const Title = styled.h2`font-family: var(--font-serif); font-size: 1.8rem; font-weight: 300; color: var(--black); margin-bottom: 0.75rem;`;
const Desc = styled.p`font-size: 0.9rem; color: var(--medium); line-height: 1.6; margin-bottom: 1rem;`;
const Card = styled.div`background: var(--off-white); padding: 1rem; text-align: left; margin-bottom: 0.5rem;`;
const Label = styled.p`font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--light);`;
const Value = styled.p`font-size: 0.95rem; color: var(--dark); margin-top: 0.15rem;`;
const IBAN = styled.p`font-family: monospace; font-size: 0.9rem; color: var(--dark);`;
const CopyBtn = styled.button`margin-top: 0.75rem; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 600; background: var(--black); color: var(--white);`;

function GiftsContent() {
  const { content } = useWedding();
  const data = content?.gifts || {};
  const title = data.title || 'Geschenke';
  const desc = data.description || 'Eure Anwesenheit ist das schönste Geschenk.';
  const bank = data.bank_details || { holder: 'Anna & Thomas', iban: 'DE89 3704 0044 0532 0130 00' };
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(bank.iban?.replace(/\s/g, '') || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Wrapper>
      <Eyebrow>Für uns</Eyebrow>
      <Title>{title}</Title>
      <Desc>{desc}</Desc>
      {bank && (
        <Card>
          <Label>Kontoinhaber</Label>
          <Value>{bank.holder}</Value>
          <div style={{marginTop:'0.5rem'}}>
            <Label>IBAN</Label>
            <IBAN>{bank.iban}</IBAN>
          </div>
        </Card>
      )}
      <CopyBtn onClick={copy}>IBAN kopieren{copied && ' ✓'}</CopyBtn>
    </Wrapper>
  );
}

export default GiftsContent;
