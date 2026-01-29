// Video Theme - SectionWrapper (Content Only, No Background)
import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Wrapper = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  scroll-snap-align: start;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentBox = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  padding-bottom: calc(var(--nav-height) + 2rem);
  
  /* Fade in when section becomes visible */
  opacity: ${p => p.$visible ? 1 : 0};
  transform: translateX(${p => p.$visible ? '0' : '30px'});
  transition: opacity 0.6s ease, transform 0.6s ease;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    padding-bottom: calc(var(--nav-height) + 1.5rem);
  }
`;

/**
 * SectionWrapper - Simple wrapper for content
 * Background is now handled by HorizontalScroll (fixed)
 */
function SectionWrapper({ id, children, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
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
