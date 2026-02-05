// src/themes/citrus/components/LottieAnimation.js
// Wrapper for Lottie animations with citrus-themed fallbacks
import React from 'react';
import Lottie from 'lottie-react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../GlobalStyles';

// ============================================
// LOTTIE WRAPPER
// ============================================
const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  width = 200,
  height = 200,
  style = {},
  className = ''
}) => {
  // If no animation data, show a fallback
  if (!animationData) {
    return (
      <FallbackWrapper style={{ width, height, ...style }} className={className}>
        <RollingLime />
      </FallbackWrapper>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={{ width, height, ...style }}
      className={className}
    />
  );
};

export default LottieAnimation;

// ============================================
// CSS ANIMATED FALLBACKS
// ============================================

// Rolling lime animation (CSS fallback)
const roll = keyframes`
  0% {
    transform: translateX(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100px) rotate(720deg);
    opacity: 0;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0) scaleY(1);
  }
  50% {
    transform: translateY(-20px) scaleY(0.95);
  }
`;

const FallbackWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const RollingLime = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, ${colors.lime}, ${colors.leafGreen});
  box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.2),
              inset 5px 5px 10px rgba(255, 255, 255, 0.3);
  animation: ${roll} 3s ease-in-out infinite;
`;

// Bouncing citrus
export const BouncingCitrus = styled.div`
  width: ${p => p.$size || 40}px;
  height: ${p => p.$size || 40}px;
  border-radius: 50%;
  background: ${p => p.$color || colors.lime};
  box-shadow: inset -5px -5px 15px rgba(0, 0, 0, 0.15),
              inset 3px 3px 8px rgba(255, 255, 255, 0.4);
  animation: ${bounce} ${p => p.$speed || 2}s ease-in-out infinite;
  animation-delay: ${p => p.$delay || 0}s;
`;

// Decorative slice
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const SpinningSlice = styled.div`
  width: ${p => p.$size || 80}px;
  height: ${p => p.$size || 80}px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${colors.lime} 0deg 36deg,
    #E8F5C8 36deg 72deg,
    ${colors.lime} 72deg 108deg,
    #E8F5C8 108deg 144deg,
    ${colors.lime} 144deg 180deg,
    #E8F5C8 180deg 216deg,
    ${colors.lime} 216deg 252deg,
    #E8F5C8 252deg 288deg,
    ${colors.lime} 288deg 324deg,
    #E8F5C8 324deg 360deg
  );
  border: 6px solid ${colors.leafGreen};
  animation: ${spin} 20s linear infinite;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: #F5FFE8;
  }
`;
