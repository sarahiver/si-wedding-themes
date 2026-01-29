// ContentBranch - Content that grows from tree branches
// Each section appears as if growing from a branch
import React from 'react';
import styled, { keyframes } from 'styled-components';

const growIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const BranchContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: ${p => p.$side === 'left' ? 'flex-start' : p.$side === 'right' ? 'flex-end' : 'center'};
  padding: ${p => p.$side === 'center' ? '0' : '0 5%'};
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 0 1rem;
  }
`;

const ContentLeaf = styled.div`
  position: relative;
  max-width: ${p => p.$wide ? '600px' : '450px'};
  width: 100%;
  padding: 2rem;
  background: var(--white);
  border: 1px solid var(--pale);
  
  /* Subtle shadow like paper */
  box-shadow: 
    2px 2px 0 var(--off-white),
    4px 4px 0 var(--pale);
  
  /* Animate in when visible */
  opacity: 0;
  animation: ${growIn} 0.8s var(--ease-out) forwards;
  animation-delay: ${p => p.$delay || '0s'};
  
  /* Connection line to branch */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    ${p => p.$side === 'left' ? 'right: 100%;' : p.$side === 'right' ? 'left: 100%;' : 'display: none;'}
    width: 30px;
    height: 1px;
    background: var(--bark);
    opacity: 0.4;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  /* Small decorative leaf/bud at connection */
  &::after {
    content: '❧';
    position: absolute;
    top: 50%;
    transform: translateY(-50%) ${p => p.$side === 'left' ? 'scaleX(-1)' : ''};
    ${p => p.$side === 'left' ? 'right: calc(100% + 25px);' : p.$side === 'right' ? 'left: calc(100% + 25px);' : 'display: none;'}
    font-size: 1rem;
    color: var(--bark);
    opacity: 0.4;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const LeafHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: ${p => p.$align || 'left'};
`;

const Eyebrow = styled.p`
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--light);
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  color: var(--black);
`;

const LeafContent = styled.div`
  /* Content styles */
`;

// Export components for use in sections
export { BranchContainer, ContentLeaf, LeafHeader, Eyebrow, Title, LeafContent };

// Simple wrapper component
function ContentBranch({ 
  side = 'left', // 'left', 'right', or 'center'
  wide = false,
  delay = '0s',
  eyebrow,
  title,
  align = 'left',
  children 
}) {
  return (
    <BranchContainer $side={side}>
      <ContentLeaf $side={side} $wide={wide} $delay={delay}>
        {(eyebrow || title) && (
          <LeafHeader $align={align}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <Title>{title}</Title>}
          </LeafHeader>
        )}
        <LeafContent>
          {children}
        </LeafContent>
      </ContentLeaf>
    </BranchContainer>
  );
}

export default ContentBranch;
