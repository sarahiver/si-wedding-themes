// ContentBox - Animated container that grows from fruit position
import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { fruitPositions } from './TreeSVG';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Box = styled.div`
  position: fixed;
  background: var(--white);
  border: 1px solid var(--dark);
  z-index: 100;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Initial state - small circle at fruit position */
  width: 26px;
  height: 30px;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  
  /* Growing state */
  ${p => p.$state === 'growing' && css`
    opacity: 1;
    transition: 
      width 0.5s var(--ease-bounce),
      height 0.5s var(--ease-bounce),
      border-radius 0.4s ease,
      top 0.5s var(--ease-bounce),
      left 0.5s var(--ease-bounce),
      transform 0.5s var(--ease-bounce);
  `}
  
  /* Open state */
  ${p => p.$state === 'open' && css`
    width: 90%;
    max-width: 480px;
    height: auto;
    min-height: 280px;
    border-radius: 0;
    padding: 2.5rem;
    pointer-events: auto;
    opacity: 1;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    box-shadow: 0 20px 80px rgba(0,0,0,0.12);
  `}
  
  /* Shrinking state */
  ${p => p.$state === 'shrinking' && css`
    transition: 
      width 0.35s var(--ease-in),
      height 0.35s var(--ease-in),
      border-radius 0.25s ease,
      top 0.35s var(--ease-in),
      left 0.35s var(--ease-in),
      transform 0.35s var(--ease-in),
      opacity 0.25s ease 0.15s;
    width: 26px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    opacity: 0;
  `}
`;

const Inner = styled.div`
  width: 100%;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.25s ease, transform 0.25s ease;
  
  ${p => p.$visible && css`
    opacity: 1;
    transform: scale(1);
    transition-delay: 0.25s;
  `}
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border: 1px solid var(--pale);
  font-size: 1.3rem;
  color: var(--light);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  
  ${p => p.$visible && css`
    opacity: 1;
    transition-delay: 0.35s;
  `}
  
  &:hover {
    color: var(--dark);
    border-color: var(--dark);
  }
`;

function ContentBox({ sectionId, isActive, onClose, children }) {
  const boxRef = useRef(null);
  const [state, setState] = useState('closed');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Get fruit screen position
  const getFruitScreenPosition = () => {
    const svg = document.getElementById('treeSvg');
    if (!svg) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const fruitPos = fruitPositions[sectionId];
    if (!fruitPos) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    const svgRect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    
    const scaleX = svgRect.width / viewBox.width;
    const scaleY = svgRect.height / viewBox.height;
    
    return {
      x: svgRect.left + fruitPos.cx * scaleX,
      y: svgRect.top + fruitPos.cy * scaleY
    };
  };

  useEffect(() => {
    if (isActive && state === 'closed') {
      // Opening
      const pos = getFruitScreenPosition();
      setPosition(pos);
      setState('growing');
      
      // Small delay then expand
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setState('open');
        });
      });
    } else if (!isActive && (state === 'open' || state === 'growing')) {
      // Closing
      const pos = getFruitScreenPosition();
      setPosition(pos);
      setState('shrinking');
      
      setTimeout(() => {
        setState('closed');
      }, 400);
    }
  }, [isActive, sectionId]);

  if (state === 'closed') return null;

  const style = state === 'growing' || state === 'shrinking' ? {
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -50%)'
  } : {};

  return (
    <Box ref={boxRef} $state={state} style={style}>
      <CloseBtn $visible={state === 'open'} onClick={onClose}>×</CloseBtn>
      <Inner $visible={state === 'open'}>
        {children}
      </Inner>
    </Box>
  );
}

export default ContentBox;
