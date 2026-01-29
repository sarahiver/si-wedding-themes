import React, { useState } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const Desc = styled.p`font-size: 0.9rem; color: var(--medium); text-align: center; margin-bottom: 1rem; line-height: 1.6;`;
const BankCard = styled.div`background: var(--off-white); padding: 1rem; margin-bottom: 0.5rem;`;
const Label = styled.p`font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--light);`;
const Value = styled.p`font-size: 0.95rem; color: var(--dark); margin-top: 0.15rem;`;
const IBAN = styled.p`font-family: monospace; font-size: 0.9rem; color: var(--dark);`;
const CopyBtn = styled.button`margin-top: 0.75rem; padding: 0.6rem 1rem; font-size: 0.75rem; font-weight: 600; background: var(--black); color: var(--white); cursor: pointer;`;
const CopyMsg = styled.span`margin-left: 0.5rem; font-size: 0.7rem; color: var(--medium);`;

function Gifts({ side = 'right' }) {
  const { content } = useWedding();
  const g = content?.gifts || {};
  const bank = g.bank_details || { holder: 'Anna & Thomas', iban: 'DE89 3704 0044 0532 0130 00' };
  const [copied, setCopied] = useState(false);
  const copyIBAN = () => { navigator.clipboard.writeText(bank.iban?.replace(/\s/g, '') || ''); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <ContentBranch side={side} eyebrow="Für uns" title={g.title || 'Geschenke'}>
      <Desc>{g.description || 'Eure Anwesenheit ist das schönste Geschenk.'}</Desc>
      {bank && <BankCard><Label>Kontoinhaber</Label><Value>{bank.holder}</Value><div style={{marginTop:'0.5rem'}}><Label>IBAN</Label><IBAN>{bank.iban}</IBAN></div></BankCard>}
      <CopyBtn onClick={copyIBAN}>IBAN kopieren{copied && <CopyMsg>✓</CopyMsg>}</CopyBtn>
    </ContentBranch>
  );
}
export default Gifts;
