import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import ContentBranch from './ContentBranch';

const Grid = styled.div`display: flex; gap: 1rem; margin-bottom: 1rem;`;
const Card = styled.div`flex: 1; background: ${p => p.$dark ? 'var(--dark)' : 'var(--off-white)'}; padding: 0.75rem;`;
const CardTitle = styled.h4`font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${p => p.$dark ? 'var(--pale)' : 'var(--light)'}; margin-bottom: 0.3rem;`;
const CardText = styled.p`font-size: 0.8rem; color: ${p => p.$dark ? 'var(--off-white)' : 'var(--medium)'}; line-height: 1.5;`;
const Address = styled.p`font-size: 0.9rem; color: var(--medium); text-align: center; margin-bottom: 1rem;`;
const MapsBtn = styled.a`display: block; text-align: center; padding: 0.75rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--black); color: var(--white); &:hover { opacity: 0.8; }`;

function Directions({ side = 'right' }) {
  const { content } = useWedding();
  const d = content?.directions || {};
  const address = d.address || 'Waldweg 12, 12345 Naturstadt';

  return (
    <ContentBranch side={side} eyebrow="So kommt ihr hin" title={d.title || 'Anfahrt'}>
      <Grid>
        <Card $dark><CardTitle $dark>Auto</CardTitle><CardText $dark>{d.parking_info || 'Kostenlose Parkplätze vor Ort.'}</CardText></Card>
        <Card><CardTitle>ÖPNV</CardTitle><CardText>{d.public_transport || 'Bus 123 bis Waldkapelle.'}</CardText></Card>
      </Grid>
      <Address>{address}</Address>
      <MapsBtn href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank">Google Maps</MapsBtn>
    </ContentBranch>
  );
}
export default Directions;
