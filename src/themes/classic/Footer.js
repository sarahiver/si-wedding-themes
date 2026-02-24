import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import { optimizedUrl } from '../../lib/cloudinary';
const bgImg1='https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';
const bgImg2='https://res.cloudinary.com/si-weddings/image/upload/v1770716464/siwedding/demo-botanical/lovestory/rg54tyya7phb75yg6dsk.jpg';

const S = styled.footer`display:grid;grid-template-columns:1fr 0.7fr 1fr;min-height:50vh;
  @media(max-width:768px){grid-template-columns:1fr;min-height:auto;}`;
const ImgSide = styled.div`overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:brightness(0.85);}
  @media(max-width:768px){height:30vh;}`;
const TxtSide = styled.div`background:var(--c-cream,#FDFCFA);display:flex;flex-direction:column;justify-content:center;
  padding:clamp(2.5rem,4vw,4rem);text-align:center;`;
const Script = styled.div`font-family:var(--font-s);font-size:clamp(2rem,4vw,3rem);color:var(--c-accent);margin-bottom:1.2rem;`;
const Dt = styled.p`font-family:var(--font-d);font-size:1.1rem;font-style:italic;color:var(--c-text-sec);margin-bottom:1.5rem;`;
const Line = styled.div`width:35px;height:1px;background:var(--c-text-muted);opacity:0.3;margin:0 auto 1.2rem;`;
const Hash = styled.p`font-size:0.85rem;letter-spacing:0.1em;color:var(--c-text-muted);margin-bottom:2.5rem;`;
const Brand = styled.p`font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--c-text-muted);
  a{color:var(--c-text-sec);text-decoration:none;&:hover{color:var(--c-text);}}`;

function Footer(){
  const{project,content}=useWedding();
  const cn=project?.couple_names||'Anna & Max';
  const dt=project?.wedding_date?new Date(project.wedding_date).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}):'';
  const hash=project?.hashtag||'';
  const img1=content?.footer?.image||bgImg1;
  const img2=content?.footer?.image2||bgImg2;
  return(
    <S>
      <ImgSide><img src={optimizedUrl.card(img1)} alt="" loading="lazy"/></ImgSide>
      <TxtSide>
        <Script>{cn}</Script>
        {dt&&<Dt>{dt}</Dt>}
        <Line/>
        {hash&&<Hash>{hash}</Hash>}
        <Brand>Made with love by <a href="https://siwedding.de" target="_blank" rel="noopener noreferrer">S&I.</a></Brand>
        <Brand style={{ marginTop: '0.5rem' }}>
          <a href="/datenschutz" target="_blank" rel="noopener noreferrer">Datenschutz</a>
          {' · '}
          <a href="/impressum" target="_blank" rel="noopener noreferrer">Impressum</a>
        </Brand>
      </TxtSide>
      <ImgSide><img src={optimizedUrl.card(img2)} alt="" loading="lazy"/></ImgSide>
    </S>);
}
export default Footer;
