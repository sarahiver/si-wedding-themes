import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const pulse = keyframes`0%, 100% { opacity: 0.3; } 50% { opacity: 1; }`;
const Screen = styled.div`position: fixed; inset: 0; z-index: 9999; background: #F5F0EB; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: ${fadeIn} 0.3s ease;`;
const Logo = styled.div`font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 300; color: #C4A87C; letter-spacing: 0.05em; margin-bottom: 2rem;`;
const Dots = styled.div`display: flex; gap: 0.5rem;`;
const Dot = styled.div`width: 5px; height: 5px; border-radius: 50%; background: #C4A87C; animation: ${pulse} 1.2s ease-in-out infinite; animation-delay: ${p => p.$d}s;`;
function LoadingScreen(){return(<Screen><Logo>S&I.</Logo><Dots><Dot $d={0}/><Dot $d={0.2}/><Dot $d={0.4}/></Dots></Screen>);}
export default LoadingScreen;
