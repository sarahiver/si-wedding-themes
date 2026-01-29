// Video Theme - HorizontalScroll with Fixed Background
import React, { useRef, useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Fixed Background Layer
const FixedBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  
  /* S/W Filter */
  filter: grayscale(100%);
  
  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background: rgba(10, 10, 10, 0.6);
  
  /* Vignette */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(10, 10, 10, 0.4) 100%
    );
  }
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Enable touch scrolling */
  -webkit-overflow-scrolling: touch;
`;

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.7) 70%, transparent 100%);
  padding: 0 2rem;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const NavList = styled.ul`
  display: flex;
  align-items: baseline;
  gap: 2rem;
  list-style: none;
  max-width: 100%;
  overflow-x: auto;
  padding: 1rem 0;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  
  @media (max-width: 768px) { gap: 1.25rem; }
`;

const NavItem = styled.li`
  position: relative;
  white-space: nowrap;
`;

const NavButton = styled.button`
  font-family: var(--font-primary);
  font-weight: ${p => p.$active ? '600' : '400'};
  font-size: ${p => p.$active ? '0.9rem' : '0.7rem'};
  color: ${p => p.$active ? 'var(--video-white)' : 'var(--video-gray)'};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: all 0.4s var(--ease-smooth);
  padding: 0.5rem 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--video-accent);
    transform: scaleX(${p => p.$active ? 1 : 0});
    transform-origin: center;
    transition: transform 0.4s var(--ease-out-expo);
  }
  
  &:hover {
    color: var(--video-white);
    &::after { transform: scaleX(1); }
  }
  
  @media (max-width: 768px) {
    font-size: ${p => p.$active ? '0.75rem' : '0.6rem'};
    letter-spacing: 0.1em;
  }
`;

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 1001;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--video-accent);
  width: ${p => p.$progress}%;
  transition: width 0.3s var(--ease-smooth);
`;

const ScrollHint = styled.div`
  position: fixed;
  bottom: calc(var(--nav-height) + 1rem);
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-primary);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--video-gray);
  opacity: ${p => p.$show ? 1 : 0};
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1000;
  
  @media (max-width: 768px) { display: none; }
`;

const Arrow = styled.span`
  display: inline-block;
  animation: ${keyframes`
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  `} 1.5s ease-in-out infinite;
`;

/**
 * HorizontalScroll - Container with FIXED background
 */
function HorizontalScroll({ sections, background, children }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Handle scroll to update active section and progress
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    const newProgress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setProgress(newProgress);
    
    const sectionWidth = clientWidth;
    const newIndex = Math.round(scrollLeft / sectionWidth);
    setActiveIndex(Math.min(newIndex, sections.length - 1));
    
    if (scrollLeft > 50) setShowHint(false);
  }, [sections.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Navigate to section
  const scrollToSection = useCallback((index) => {
    if (!containerRef.current) return;
    const sectionWidth = containerRef.current.clientWidth;
    containerRef.current.scrollTo({
      left: sectionWidth * index,
      behavior: 'smooth'
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && activeIndex < sections.length - 1) {
        scrollToSection(activeIndex + 1);
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        scrollToSection(activeIndex - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, sections.length, scrollToSection]);

  // FIXED: Mouse wheel to horizontal scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current) return;
      
      // Prevent default vertical scroll
      e.preventDefault();
      
      // Convert vertical scroll to horizontal
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      
      containerRef.current.scrollBy({
        left: delta,
        behavior: 'auto'
      });
    };
    
    // Add to window to catch all wheel events
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      {/* Fixed Background */}
      <FixedBackground>
        {background?.url ? (
          background.type === 'video' ? (
            <video src={background.url} muted loop autoPlay playsInline />
          ) : (
            <img src={background.url} alt="" />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A1A, #0A0A0A)' }} />
        )}
      </FixedBackground>
      <BackgroundOverlay />
      
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
      
      <Container ref={containerRef}>
        {children}
      </Container>
      
      <Navigation>
        <NavList>
          {sections.map((section, index) => (
            <NavItem key={section.id}>
              <NavButton
                $active={index === activeIndex}
                onClick={() => scrollToSection(index)}
              >
                {section.label}
              </NavButton>
            </NavItem>
          ))}
        </NavList>
      </Navigation>
      
      <ScrollHint $show={showHint}>
        Scroll <Arrow>→</Arrow>
      </ScrollHint>
    </>
  );
}

export default HorizontalScroll;
