// Video Theme - Footer (Cinematic Finale)
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import SectionWrapper from './SectionWrapper';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeUp = keyframes`from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); }`;
const lineExpand = keyframes`from { transform: scaleX(0); } to { transform: scaleX(1); }`;

const Content = styled.div`text-align: center; max-width: 600px; width: 100%;`;

const Names = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--video-white);
  line-height: 1;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 1.2s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.3s;
`;

const DateText = styled.p`
  font-family: var(--font-accent);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-style: italic;
  color: var(--video-silver);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 0.6s;
`;

const Divider = styled.div`
  width: 100px;
  height: 1px;
  background: var(--video-accent);
  margin: 2rem auto;
  transform-origin: center;
  transform: scaleX(0);
  animation: ${p => p.$visible ? css`${lineExpand} 1s var(--ease-out-expo) forwards` : 'none'};
  animation-delay: 0.8s;
`;

const Quote = styled.p`
  font-family: var(--font-accent);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-style: italic;
  color: var(--video-silver);
  max-width: 400px;
  margin: 0 auto 2rem;
  line-height: 1.8;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1s;
`;

const Tagline = styled.p`
  font-family: var(--font-accent);
  font-size: 1.1rem;
  font-style: italic;
  color: var(--video-silver);
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.1s;
`;

const Hashtag = styled.p`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--video-accent);
  margin-bottom: 3rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeUp} 0.8s ease forwards` : 'none'};
  animation-delay: 1.2s;
`;

const AdminBtn = styled.button`
  font-family: var(--font-primary);
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--video-gray);
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 0.8s ease forwards` : 'none'};
  animation-delay: 1.4s;
  
  &:hover { color: var(--video-white); border-color: var(--video-accent); }
`;

const Copyright = styled.p`
  font-family: var(--font-primary);
  font-size: 0.65rem;
  color: var(--video-gray);
  margin-top: 2rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 0.8s ease forwards` : 'none'};
  animation-delay: 1.6s;
`;

const PoweredBy = styled.a`
  display: block;
  font-family: var(--font-primary);
  font-size: 0.6rem;
  color: var(--video-gray);
  text-decoration: none;
  margin-top: 0.5rem;
  opacity: 0;
  animation: ${p => p.$visible ? css`${fadeIn} 0.8s ease forwards` : 'none'};
  animation-delay: 1.8s;
  &:hover { color: var(--video-accent); }
`;


function Footer() {
  const { project, content, slug } = useWedding();
  const footerData = content?.footer || {};
  const name1 = project?.partner1_name || 'Emma';
  const name2 = project?.partner2_name || 'Noah';
  const date = project?.wedding_date;
  const hashtag = footerData.hashtag;
  const tagline = footerData.tagline;
  
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const formattedDate = date ? new Date(date).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAdminClick = () => {
    const adminPath = slug ? `/${slug}/admin` : '/admin';
    window.location.href = adminPath;
  };

  return (
    <SectionWrapper id="footer">
      <Content ref={sectionRef}>
        <Names $visible={visible}>{name1} & {name2}</Names>
        {formattedDate && <DateText $visible={visible}>{formattedDate}</DateText>}
        <Divider $visible={visible} />
        <Quote $visible={visible}>"Danke, dass ihr Teil unserer Geschichte seid"</Quote>
        {tagline && <Tagline $visible={visible}>{tagline}</Tagline>}
        {hashtag && <Hashtag $visible={visible}>#{hashtag}</Hashtag>}
        <AdminBtn $visible={visible} onClick={handleAdminClick}>Admin</AdminBtn>
        <Copyright $visible={visible}>© {new Date().getFullYear()} {name1} & {name2}</Copyright>
        <PoweredBy $visible={visible} href="https://siwedding.de" target="_blank" rel="noopener noreferrer">Powered by S&I.</PoweredBy>
      </Content>
    </SectionWrapper>
  );
}

export default Footer;
