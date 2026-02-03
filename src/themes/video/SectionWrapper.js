// Video Theme - SectionWrapper with vertical scroll for overflow content
import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  /* Allow vertical scroll ONLY if content overflows */
  overflow-x: hidden;
  overflow-y: auto;

  /* Hide scrollbar but allow scrolling */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }

  /* Ensure touch scroll works */
  -webkit-overflow-scrolling: touch;
`;

const ContentBox = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 1.5rem;
  padding-bottom: calc(var(--nav-height) + 4rem);
  padding-top: 3rem;

  /* Center vertically when content fits */
  margin: auto 0;

  /* Fade in animation */
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : '20px'});
  transition: opacity 0.5s ease, transform 0.5s ease;

  @media (max-width: 768px) {
    padding: 2rem 1.25rem;
    padding-bottom: 5rem;
    padding-top: 2rem;
    box-sizing: border-box;
  }
`;

function SectionWrapper({ id, children, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <Wrapper ref={sectionRef} id={id} className={className}>
      <ContentBox $visible={isVisible}>
        {children}
      </ContentBox>
    </Wrapper>
  );
}

export default SectionWrapper;
