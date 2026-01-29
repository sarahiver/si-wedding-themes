// Botanical TreeIllustrations - SVG Watercolor-style Trees & Plants
import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// Animations
const sway = keyframes`
  0%, 100% { transform: rotate(-3deg); transform-origin: bottom center; }
  50% { transform: rotate(3deg); transform-origin: bottom center; }
`;

const swayGentle = keyframes`
  0%, 100% { transform: rotate(-1.5deg); transform-origin: bottom center; }
  50% { transform: rotate(1.5deg); transform-origin: bottom center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const grow = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

// Styled wrapper for trees
const TreeWrapper = styled.div`
  position: absolute;
  animation: ${p => p.$sway ? css`${sway} ${p.$duration || '4s'} ease-in-out infinite` : 'none'};
  animation-delay: ${p => p.$delay || '0s'};
  opacity: ${p => p.$opacity || 1};
  transform-origin: bottom center;
  
  svg {
    width: ${p => p.$size || '100px'};
    height: auto;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  }
`;

const LeafWrapper = styled.div`
  position: absolute;
  animation: ${float} ${p => p.$duration || '3s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

// ============================================
// TREE COMPONENTS - Watercolor Style
// ============================================

// Round Tree (like in the reference image)
export const RoundTree = ({ color = '#9CAF88', size = '120px', ...props }) => (
  <TreeWrapper $size={size} {...props}>
    <svg viewBox="0 0 100 140" fill="none">
      {/* Tree trunk */}
      <path d="M45 90 L45 130 Q50 135 55 130 L55 90" fill="#5C4D3C" />
      {/* Round foliage - watercolor blob effect */}
      <ellipse cx="50" cy="50" rx="40" ry="45" fill={color} opacity="0.9" />
      <ellipse cx="45" cy="45" rx="30" ry="35" fill={color} opacity="0.7" />
      <ellipse cx="55" cy="55" rx="25" ry="30" fill={color} opacity="0.5" />
      {/* Highlight */}
      <ellipse cx="35" cy="35" rx="10" ry="12" fill="white" opacity="0.3" />
    </svg>
  </TreeWrapper>
);

// Tall Pine Tree
export const PineTree = ({ color = '#4A5D41', size = '80px', ...props }) => (
  <TreeWrapper $size={size} {...props}>
    <svg viewBox="0 0 60 120" fill="none">
      <path d="M28 100 L28 115 L32 115 L32 100" fill="#5C4D3C" />
      <path d="M30 10 L10 45 L18 45 L5 75 L15 75 L0 100 L60 100 L45 75 L55 75 L42 45 L50 45 Z" fill={color} opacity="0.9" />
      <path d="M30 15 L15 45 L22 45 L12 70 L55 70 L45 45 L52 45 Z" fill={color} opacity="0.6" />
    </svg>
  </TreeWrapper>
);

// Weeping Willow style
export const WillowTree = ({ color = '#6B7F5E', size = '150px', ...props }) => (
  <TreeWrapper $size={size} {...props}>
    <svg viewBox="0 0 120 140" fill="none">
      <path d="M55 80 L55 130 Q60 135 65 130 L65 80" fill="#5C4D3C" />
      {/* Drooping branches */}
      <ellipse cx="60" cy="50" rx="50" ry="40" fill={color} opacity="0.8" />
      <path d="M20 50 Q15 90 25 100" stroke={color} strokeWidth="8" fill="none" opacity="0.7" />
      <path d="M40 55 Q35 95 45 110" stroke={color} strokeWidth="6" fill="none" opacity="0.6" />
      <path d="M80 55 Q85 95 75 110" stroke={color} strokeWidth="6" fill="none" opacity="0.6" />
      <path d="M100 50 Q105 90 95 100" stroke={color} strokeWidth="8" fill="none" opacity="0.7" />
    </svg>
  </TreeWrapper>
);

// Abstract circular tree (watercolor blob)
export const BlobTree = ({ color = '#B8D4BE', color2 = '#9CAF88', size = '100px', ...props }) => (
  <TreeWrapper $size={size} {...props}>
    <svg viewBox="0 0 80 110" fill="none">
      <path d="M38 70 L38 100 L42 100 L42 70" fill="#5C4D3C" />
      <circle cx="40" cy="40" r="35" fill={color} opacity="0.8" />
      <circle cx="35" cy="35" r="25" fill={color2} opacity="0.6" />
      <circle cx="50" cy="45" r="20" fill={color} opacity="0.5" />
      <circle cx="30" cy="28" r="8" fill="white" opacity="0.3" />
    </svg>
  </TreeWrapper>
);

// Skinny tall tree
export const TallTree = ({ color = '#5B8A72', size = '60px', ...props }) => (
  <TreeWrapper $size={size} {...props}>
    <svg viewBox="0 0 40 140" fill="none">
      <path d="M18 110 L18 135 L22 135 L22 110" fill="#5C4D3C" />
      <ellipse cx="20" cy="60" rx="15" ry="55" fill={color} opacity="0.9" />
      <ellipse cx="18" cy="55" rx="10" ry="40" fill={color} opacity="0.6" />
    </svg>
  </TreeWrapper>
);

// Bush / Shrub
export const Bush = ({ color = '#C5D86D', size = '80px', ...props }) => (
  <TreeWrapper $size={size} $sway={false} {...props}>
    <svg viewBox="0 0 100 60" fill="none">
      <ellipse cx="50" cy="35" rx="45" ry="25" fill={color} opacity="0.8" />
      <ellipse cx="30" cy="30" rx="25" ry="20" fill={color} opacity="0.6" />
      <ellipse cx="70" cy="30" rx="25" ry="20" fill={color} opacity="0.6" />
      <ellipse cx="50" cy="25" rx="20" ry="15" fill={color} opacity="0.4" />
    </svg>
  </TreeWrapper>
);

// Single Leaf
export const Leaf = ({ color = '#9CAF88', size = '30px', rotation = 0, ...props }) => (
  <LeafWrapper $size={size} {...props}>
    <svg viewBox="0 0 30 40" fill="none" style={{ width: size, transform: `rotate(${rotation}deg)` }}>
      <path d="M15 5 Q25 15 20 30 Q15 35 10 30 Q5 15 15 5" fill={color} opacity="0.8" />
      <path d="M15 8 L15 28" stroke="#5C4D3C" strokeWidth="1" opacity="0.5" />
    </svg>
  </LeafWrapper>
);

// Decorative branch with leaves
export const Branch = ({ color = '#6B7F5E', size = '150px', ...props }) => (
  <TreeWrapper $size={size} $sway {...props}>
    <svg viewBox="0 0 150 80" fill="none">
      <path d="M10 60 Q50 40 90 50 Q130 60 145 40" stroke="#5C4D3C" strokeWidth="3" fill="none" />
      <ellipse cx="30" cy="35" rx="15" ry="20" fill={color} opacity="0.8" />
      <ellipse cx="60" cy="30" rx="12" ry="18" fill={color} opacity="0.7" />
      <ellipse cx="90" cy="35" rx="14" ry="19" fill={color} opacity="0.8" />
      <ellipse cx="120" cy="28" rx="13" ry="17" fill={color} opacity="0.7" />
    </svg>
  </TreeWrapper>
);

// Sheep (cute addition like in reference)
export const Sheep = ({ size = '40px', ...props }) => (
  <TreeWrapper $size={size} $sway={false} {...props}>
    <svg viewBox="0 0 50 35" fill="none">
      {/* Body - fluffy */}
      <ellipse cx="25" cy="20" rx="18" ry="12" fill="#E8E8E8" />
      <circle cx="15" cy="18" r="6" fill="#E8E8E8" />
      <circle cx="35" cy="18" r="6" fill="#E8E8E8" />
      <circle cx="25" cy="12" r="5" fill="#E8E8E8" />
      {/* Head */}
      <ellipse cx="40" cy="15" rx="6" ry="5" fill="#3D4739" />
      {/* Legs */}
      <rect x="15" y="28" width="3" height="6" fill="#3D4739" />
      <rect x="32" y="28" width="3" height="6" fill="#3D4739" />
    </svg>
  </TreeWrapper>
);

// Export a forest scene component
export const ForestScene = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

export default {
  RoundTree,
  PineTree,
  WillowTree,
  BlobTree,
  TallTree,
  Bush,
  Leaf,
  Branch,
  Sheep,
  ForestScene
};
