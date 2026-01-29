// Botanical Fruit Theme - WeddingPage
// Tree with fruits as navigation, content grows from fruits
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useWedding } from '../../context/WeddingContext';
import GlobalStyles from './GlobalStyles';
import TreeSVG, { fruitPositions } from './TreeSVG';
import ContentBox from './ContentBox';

// Content Components
import HeroContent from './contents/HeroContent';
import CountdownContent from './contents/CountdownContent';
import StoryContent from './contents/StoryContent';
import GalleryContent from './contents/GalleryContent';
import TimelineContent from './contents/TimelineContent';
import RSVPContent from './contents/RSVPContent';
import FAQContent from './contents/FAQContent';
import GiftsContent from './contents/GiftsContent';

import AdminDashboard from './AdminDashboard';

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--cream);
`;

const TreeLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const NavHint = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--light);
  z-index: 50;
  opacity: ${p => p.$hidden ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const AdminButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--white);
  border: 1px solid var(--pale);
  border-radius: 50%;
  z-index: 200;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  span {
    width: 4px;
    height: 4px;
    background: var(--dark);
    border-radius: 50%;
  }
`;

// Map section IDs to content components
const contentComponents = {
  hero: HeroContent,
  countdown: CountdownContent,
  story: StoryContent,
  gallery: GalleryContent,
  timeline: TimelineContent,
  rsvp: RSVPContent,
  faq: FAQContent,
  gifts: GiftsContent,
};

// Default sections order
const defaultSections = ['hero', 'countdown', 'story', 'gallery', 'timeline', 'rsvp', 'faq', 'gifts'];

function WeddingPage() {
  const { project, content, loading } = useWedding();
  const [activeSection, setActiveSection] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);

  // Get enabled sections from project or use defaults
  const sections = project?.enabled_sections?.filter(s => fruitPositions[s]) || 
                   defaultSections.filter(s => fruitPositions[s]);

  // Handle fruit click
  const handleFruitClick = useCallback((sectionId) => {
    if (isAnimating.current) return;
    
    if (activeSection === sectionId) return;
    
    isAnimating.current = true;
    setActiveSection(sectionId);
    currentIndex.current = sections.indexOf(sectionId);
    
    setTimeout(() => {
      isAnimating.current = false;
    }, 600);
  }, [activeSection, sections]);

  // Handle close
  const handleClose = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setActiveSection(null);
    
    setTimeout(() => {
      isAnimating.current = false;
    }, 450);
  }, []);

  // Navigate to next/prev section
  const navigate = useCallback((direction) => {
    if (isAnimating.current) return;
    
    const newIndex = currentIndex.current + direction;
    
    if (newIndex < 0) {
      // Close if going before first
      if (activeSection) {
        handleClose();
      }
      return;
    }
    
    if (newIndex >= sections.length) {
      return;
    }
    
    isAnimating.current = true;
    currentIndex.current = newIndex;
    setActiveSection(sections[newIndex]);
    
    setTimeout(() => {
      isAnimating.current = false;
    }, 600);
  }, [activeSection, sections, handleClose]);

  // Scroll/wheel handler - IMPROVED SENSITIVITY
  useEffect(() => {
    let accumulatedDelta = 0;
    const threshold = 30; // Lower = more sensitive
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (isAnimating.current) return;
      
      accumulatedDelta += e.deltaY;
      
      if (Math.abs(accumulatedDelta) >= threshold) {
        if (accumulatedDelta > 0) {
          // Scroll down - next or open first
          if (!activeSection) {
            handleFruitClick(sections[0]);
          } else {
            navigate(1);
          }
        } else {
          // Scroll up - previous or close
          navigate(-1);
        }
        accumulatedDelta = 0;
      }
    };
    
    // Reset accumulated delta after pause
    let resetTimeout;
    const handleWheelEnd = () => {
      clearTimeout(resetTimeout);
      resetTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('wheel', handleWheelEnd);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('wheel', handleWheelEnd);
    };
  }, [activeSection, sections, handleFruitClick, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating.current) return;
      
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (!activeSection) {
            handleFruitClick(sections[0]);
          } else {
            navigate(1);
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          navigate(-1);
          break;
        case 'Escape':
          if (activeSection) {
            handleClose();
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sections, handleFruitClick, navigate, handleClose]);

  // Touch swipe
  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      if (isAnimating.current) return;
      
      const diff = touchStartY - e.changedTouches[0].clientY;
      
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          if (!activeSection) {
            handleFruitClick(sections[0]);
          } else {
            navigate(1);
          }
        } else {
          navigate(-1);
        }
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection, sections, handleFruitClick, navigate]);

  if (loading) {
    return (
      <>
        <GlobalStyles />
        <PageWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--light)' }}>Laden...</p>
        </PageWrapper>
      </>
    );
  }

  if (showAdmin) {
    return (
      <>
        <GlobalStyles />
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <PageWrapper>
        {/* Tree with fruits */}
        <TreeLayer>
          <TreeSVG
            sections={sections}
            activeSection={activeSection}
            onFruitClick={handleFruitClick}
          />
        </TreeLayer>
        
        {/* Content boxes for each section */}
        {sections.map(sectionId => {
          const ContentComponent = contentComponents[sectionId];
          if (!ContentComponent) return null;
          
          return (
            <ContentBox
              key={sectionId}
              sectionId={sectionId}
              isActive={activeSection === sectionId}
              onClose={handleClose}
            >
              <ContentComponent />
            </ContentBox>
          );
        })}
        
        {/* Navigation hint */}
        <NavHint $hidden={!!activeSection}>
          Scroll oder klicke eine Frucht
        </NavHint>
        
        {/* Admin button */}
        <AdminButton onClick={() => setShowAdmin(true)}>
          <span /><span /><span />
        </AdminButton>
      </PageWrapper>
    </>
  );
}

export default WeddingPage;
