// TreeSVG - Architectural style tree with geometric facets and hatching
import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg`
  width: 90%;
  max-width: 700px;
  height: 90%;
  max-height: 85vh;
`;

const Fruit = styled.g`
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  &:hover {
    transform: scale(1.12);
  }
  
  &.active .fruit-shape {
    fill: var(--white);
    stroke-width: 2;
  }
  
  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
`;

const FruitLabel = styled.text`
  font-family: var(--font-sans);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  fill: var(--medium);
  text-anchor: middle;
  pointer-events: none;
`;

// Fruit positions configuration
export const fruitPositions = {
  hero: { cx: 200, cy: 82, label: 'Start' },
  countdown: { cx: 100, cy: 168, label: 'Countdown' },
  story: { cx: 300, cy: 168, label: 'Geschichte' },
  gallery: { cx: 145, cy: 240, label: 'Galerie' },
  timeline: { cx: 255, cy: 240, label: 'Ablauf' },
  rsvp: { cx: 200, cy: 285, label: 'Zusagen' },
  faq: { cx: 120, cy: 300, label: 'FAQ' },
  gifts: { cx: 280, cy: 300, label: 'Geschenke' },
};

function TreeSVG({ sections, activeSection, onFruitClick }) {
  return (
    <SVG viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet" id="treeSvg">
      <defs>
        {/* Hatch patterns */}
        <pattern id="hatch-45" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.6"/>
        </pattern>
        <pattern id="hatch-135" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(135)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.6"/>
        </pattern>
        <pattern id="hatch-90" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(90)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.5"/>
        </pattern>
        <pattern id="hatch-0" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.4"/>
        </pattern>
        <pattern id="hatch-dense" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#2d2d2d" strokeWidth="0.7" opacity="0.7"/>
        </pattern>
      </defs>
      
      {/* TRUNK */}
      <path d="M 196 320 L 196 450 L 204 450 L 204 320" fill="none" stroke="#2d2d2d" strokeWidth="1.5"/>
      <line x1="198" y1="325" x2="198" y2="445" stroke="#2d2d2d" strokeWidth="0.3" opacity="0.5"/>
      <line x1="202" y1="330" x2="202" y2="448" stroke="#2d2d2d" strokeWidth="0.3" opacity="0.4"/>
      
      {/* CROWN - Layer 1 Bottom */}
      <polygon points="150,285 180,320 200,295" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,295 180,320 220,320" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,295 220,320 250,285" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      
      {/* Layer 2 */}
      <polygon points="115,245 150,285 175,255" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="150,285 200,295 175,255" fill="url(#hatch-90)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="175,255 200,295 225,255" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,295 250,285 225,255" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="250,285 285,245 225,255" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      
      {/* Layer 3 */}
      <polygon points="95,200 115,245 145,210" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="115,245 175,255 145,210" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="145,210 175,255 180,205" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="175,255 225,255 200,215" fill="url(#hatch-90)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="180,205 175,255 200,215" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,215 225,255 220,205" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="225,255 285,245 255,210" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="220,205 225,255 255,210" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="255,210 285,245 305,200" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      
      {/* Layer 4 */}
      <polygon points="105,160 95,200 140,175" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="95,200 145,210 140,175" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="140,175 145,210 180,205" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="140,175 180,205 165,155" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="165,155 180,205 200,165" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="180,205 200,215 200,165" fill="url(#hatch-90)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,165 200,215 220,205" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,165 220,205 235,155" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="235,155 220,205 260,175" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="220,205 255,210 260,175" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="260,175 255,210 305,200" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="260,175 305,200 295,160" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      
      {/* Layer 5 Top */}
      <polygon points="125,125 105,160 155,140" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="105,160 140,175 155,140" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="155,140 140,175 165,155" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="155,140 165,155 175,115" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="165,155 200,165 190,120" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="175,115 165,155 190,120" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="190,120 200,165 210,120" fill="url(#hatch-90)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,165 235,155 210,120" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="210,120 235,155 225,115" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="225,115 235,155 245,140" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="235,155 260,175 245,140" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="245,140 260,175 275,125" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="260,175 295,160 275,125" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      
      {/* Top peaks */}
      <polygon points="170,90 155,140 190,120" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="170,90 190,120 200,95" fill="url(#hatch-45)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,95 190,120 210,120" fill="none" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="200,95 210,120 230,90" fill="url(#hatch-135)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="230,90 210,120 225,115" fill="url(#hatch-0)" stroke="#2d2d2d" strokeWidth="0.8"/>
      <polygon points="230,90 225,115 245,140" fill="url(#hatch-dense)" stroke="#2d2d2d" strokeWidth="0.8"/>
      
      {/* FRUITS - Dynamic based on sections */}
      {sections.map(sectionId => {
        const pos = fruitPositions[sectionId];
        if (!pos) return null;
        
        const isActive = activeSection === sectionId;
        const isHidden = activeSection && activeSection !== sectionId;
        
        return (
          <Fruit
            key={sectionId}
            id={`fruit-${sectionId}`}
            className={`${isActive ? 'active' : ''} ${isHidden ? 'hidden' : ''}`}
            onClick={() => onFruitClick(sectionId)}
          >
            <ellipse
              className="fruit-shape"
              cx={pos.cx}
              cy={pos.cy}
              rx="13"
              ry="15"
              fill="var(--cream)"
              stroke="#2d2d2d"
              strokeWidth="1.2"
            />
            {/* Hatching lines inside fruit */}
            <line x1={pos.cx - 6} y1={pos.cy - 4} x2={pos.cx + 6} y2={pos.cy - 4} stroke="#2d2d2d" strokeWidth="0.4" opacity="0.3"/>
            <line x1={pos.cx - 8} y1={pos.cy} x2={pos.cx + 8} y2={pos.cy} stroke="#2d2d2d" strokeWidth="0.4" opacity="0.3"/>
            <line x1={pos.cx - 6} y1={pos.cy + 4} x2={pos.cx + 6} y2={pos.cy + 4} stroke="#2d2d2d" strokeWidth="0.4" opacity="0.3"/>
            <FruitLabel x={pos.cx} y={pos.cy + 26}>{pos.label}</FruitLabel>
          </Fruit>
        );
      })}
      
      {/* Ground */}
      <line x1="130" y1="450" x2="270" y2="450" stroke="#2d2d2d" strokeWidth="0.8" opacity="0.5"/>
      <ellipse cx="200" cy="453" rx="40" ry="5" fill="none" stroke="#2d2d2d" strokeWidth="0.5" opacity="0.25"/>
    </SVG>
  );
}

export default TreeSVG;
