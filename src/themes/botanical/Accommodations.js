import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const List = styled.div`display: flex; flex-direction: column; gap: 0.75rem;`;
const Card = styled.div`background: var(--off-white); padding: 1rem;`;
const Name = styled.h3`font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 0.2rem;`;
const Address = styled.p`font-size: 0.8rem; color: var(--medium);`;
const Meta = styled.div`display: flex; justify-content: space-between; margin-top: 0.4rem;`;
const Price = styled.p`font-size: 0.85rem; font-weight: 600; color: var(--dark);`;
const Dist = styled.p`font-size: 0.75rem; color: var(--light);`;
const BookLink = styled.a`display: inline-block; margin-top: 0.4rem; font-size: 0.75rem; font-weight: 600; color: var(--dark); border-bottom: 1px solid var(--dark); &:hover { opacity: 0.6; }`;

function Accommodations({ side = 'left' }) {
  const { content } = useWedding();
  const d = content?.accommodations || {};
  const hotels = d.hotels || [
    { name: 'Waldhotel am See', address: 'Seestraße 15', price: 'ab 95€/Nacht', distance: '5 min' },
    { name: 'Landgasthof Grüne Wiese', address: 'Hauptstr. 42', price: 'ab 75€/Nacht', distance: '10 min' },
  ];

  return (
    <ContentBranch side={side} eyebrow="Übernachten" title={d.title || 'Hotels'}>
      <List>{hotels.map((h,i) => <Card key={i}><Name>{h.name}</Name><Address>{h.address}</Address><Meta>{h.price && <Price>{h.price}</Price>}{h.distance && <Dist>{h.distance}</Dist>}</Meta>{h.url && <BookLink href={h.url} target="_blank">Buchen →</BookLink>}</Card>)}</List>
    </ContentBranch>
  );
}
export default Accommodations;
