import React from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';

const bgImg = 'https://res.cloudinary.com/si-weddings/image/upload/v1770718279/wedding_photos/demo-botanical/gxmqpkk0ksnveevic9fp.jpg';

const S = styled.footer`
  display:grid;grid-template-columns:1fr 1fr;min-height:50vh;
  @media(max-width:768px){grid-template-columns:1fr;}
`;
const ImgSide = styled.div`
  overflow:hidden;
  img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) brightness(0.55);}
  @media(max-width:768px){height:35vh;}
`;
const TxtSide = styled.div`
  background:var(--c-cream,#F5F0EB);display:flex;flex-direction:column;justify-content:center;
  padding:clamp(3rem,6vw,5rem);
`;
const Script = styled.div`font-family:var(--font-s);font-size:clamp(2.5rem,5vw,3.5rem);color:var(--c-text-muted,#999);margin-bottom:1.5rem;`;
const Dt = styled.p`font-family:var(--font-d);font-size:1.1rem;font-style:italic;color:var(--c-text-sec,#555);margin-bottom:2rem;`;
const Line = styled.div`width:35px;height:1px;background:var(--c-text-muted,#999);opacity:0.3;margin-bottom:1.5rem;`;
const Hash = styled.p`font-size:0.75rem;letter-spacing:0.12em;color:var(--c-text-muted,#999);margin-bottom:3rem;`;
const Brand = styled.p`font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--c-text-muted,#999);opacity:0.5;
  a{color:var(--c-text-sec,#555);text-decoration:none;&:hover{color:var(--c-text,#111);}}`;

function Footer() {
  const { project, content } = useWedding();
  const cn = project?.couple_names || 'Anna & Max';
  const dt = project?.wedding_date ? new Date(project.wedding_date).toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}) : '';
  const hash = project?.hashtag || '';
  const img = content?.footer?.image || bgImg;

  return (
    <S>
      <ImgSide><img src={img} alt="" loading="lazy" /></ImgSide>
      <TxtSide>
        <Script>{cn}</Script>
        {dt && <Dt>{dt}</Dt>}
        <Line />
        {hash && <Hash>{hash}</Hash>}
        <Brand>Made with love by <a href="https://siwedding.de" target="_blank" rel="noopener noreferrer">S&I.</a></Brand>
      </TxtSide>
    </S>
  );
}
export default Footer;
