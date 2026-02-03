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
  filter: grayscale(100%);
  
  video, img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    position: fixed;
  }
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background: rgba(10, 10, 10, 0.6);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.4) 100%);
  }
  
  @media (max-width: 768px) {
    background: rgba(10, 10, 10, 0.75);
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
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  
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
  padding: 0 1rem;
  animation: ${fadeIn} 1s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1rem;
  list-style: none;
  flex-wrap: nowrap;
  overflow: hidden;
`;

const NavItem = styled.li`
  white-space: nowrap;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  font-family: var(--font-primary);
  font-weight: ${p => p.$active ? '600' : '400'};
  font-size: ${p => p.$active ? '0.75rem' : '0.6rem'};
  color: ${p => p.$active ? 'var(--video-white)' : 'var(--video-gray)'};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.4s var(--ease-smooth);
  padding: 0.5rem 0.25rem;
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
`;

/* Mobile Dot Navigation */
const MobileNav = styled.nav`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    z-index: 1000;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to top, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.8) 80%, transparent 100%);
    padding: 0 1rem;
    animation: ${fadeIn} 1s ease forwards;
    animation-delay: 0.5s;
    opacity: 0;
  }
`;

const DotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const Dot = styled.button`
  height: 4px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  transition: all 0.4s var(--ease-out-expo);
  
  /* Width: active = wide, others = small */
  width: ${p => p.$active ? '24px' : '4px'};
  
  /* Color: active = accent, others fade by distance */
  background: ${p => {
    if (p.$active) return 'var(--video-accent)';
    const distance = Math.abs(p.$distance);
    if (distance === 1) return 'rgba(255, 255, 255, 0.5)';
    if (distance === 2) return 'rgba(255, 255, 255, 0.3)';
    if (distance === 3) return 'rgba(255, 255, 255, 0.15)';
    return 'rgba(255, 255, 255, 0.08)';
  }};
  
  &:hover {
    background: ${p => p.$active ? 'var(--video-accent)' : 'rgba(255, 255, 255, 0.6)'};
  }
`;

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
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

function HorizontalScroll({ sections, background, backgroundMobile, children }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Choose background based on device
  const activeBackground = (isMobile && backgroundMobile?.url) ? backgroundMobile : background;

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

  // Mousewheel to snap-scroll sections (Desktop only)
  const isScrollingRef = useRef(false);
  const scrollCooldownRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current) return;

      // Only on desktop
      if (window.innerWidth <= 768) return;

      e.preventDefault();

      // If currently in scroll animation, ignore
      if (isScrollingRef.current) return;

      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      // Threshold to trigger section change
      if (Math.abs(delta) < 30) return;

      // Determine direction and target section
      const direction = delta > 0 ? 1 : -1;
      const targetIndex = Math.max(0, Math.min(sections.length - 1, activeIndex + direction));

      // Don't scroll if already at boundary
      if (targetIndex === activeIndex) return;

      // Lock scrolling
      isScrollingRef.current = true;

      // Scroll to target section
      scrollToSection(targetIndex);

      // Cooldown before allowing next scroll (matches animation duration)
      clearTimeout(scrollCooldownRef.current);
      scrollCooldownRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollCooldownRef.current);
    };
  }, [activeIndex, sections.length, scrollToSection]);

  return (
    <>
      <FixedBackground>
        {activeBackground?.url ? (
          activeBackground.type === 'video' ? (
            <video src={activeBackground.url} muted loop autoPlay playsInline />
          ) : (
            <img src={activeBackground.url} alt="" />
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
      
      <MobileNav>
        <DotContainer>
          {sections.map((section, index) => (
            <Dot
              key={section.id}
              $active={index === activeIndex}
              $distance={index - activeIndex}
              onClick={() => scrollToSection(index)}
              aria-label={section.label}
            />
          ))}
        </DotContainer>
      </MobileNav>
      
      <ScrollHint $show={showHint}>
        Scroll <Arrow>→</Arrow>
      </ScrollHint>
    </>
  );
}

export default HorizontalScroll;
