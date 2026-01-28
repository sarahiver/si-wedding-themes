// src/components/shared/FeedbackModal.js
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const checkmark = keyframes`
  0% { stroke-dashoffset: 50; }
  100% { stroke-dashoffset: 0; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

// ═══════════════════════════════════════════════════════════════════════════
// STYLED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  animation: ${fadeIn} 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  min-width: 320px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 10001;
  animation: ${slideUp} 0.3s ease;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => {
    switch (p.$type) {
      case 'success': return 'rgba(39, 174, 96, 0.1)';
      case 'error': return 'rgba(192, 57, 43, 0.1)';
      case 'loading': return 'rgba(52, 152, 219, 0.1)';
      default: return 'rgba(149, 165, 166, 0.1)';
    }
  }};
`;

const SuccessIcon = styled.svg`
  width: 40px;
  height: 40px;
  
  circle {
    fill: none;
    stroke: #27ae60;
    stroke-width: 3;
  }
  
  path {
    fill: none;
    stroke: #27ae60;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 50;
    animation: ${checkmark} 0.4s ease forwards;
    animation-delay: 0.2s;
    stroke-dashoffset: 50;
  }
`;

const ErrorIcon = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  animation: ${shake} 0.4s ease;
  
  &::before, &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 4px;
    background: #c0392b;
    border-radius: 2px;
  }
  
  &::before { transform: translate(-50%, -50%) rotate(45deg); }
  &::after { transform: translate(-50%, -50%) rotate(-45deg); }
`;

const LoadingIcon = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(52, 152, 219, 0.2);
  border-top-color: #3498db;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Title = styled.h3`
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.75rem;
`;

const Message = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 0.95rem;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  font-family: 'Lato', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background: ${p => {
    switch (p.$type) {
      case 'success': return '#27ae60';
      case 'error': return '#c0392b';
      default: return '#3498db';
    }
  }};
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * FeedbackModal - Shows success/error/loading feedback
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {function} props.onClose - Close handler
 * @param {'success'|'error'|'loading'} props.type - Modal type
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {number} props.autoClose - Auto-close after ms (0 = no auto-close)
 */
function FeedbackModal({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message,
  autoClose = 0,
  buttonText,
}) {
  // Auto-close functionality
  useEffect(() => {
    if (isOpen && autoClose > 0 && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, type, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultTitles = {
    success: 'Erfolgreich!',
    error: 'Fehler',
    loading: 'Wird gespeichert...',
  };

  const defaultMessages = {
    success: 'Die Änderungen wurden erfolgreich gespeichert.',
    error: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    loading: 'Bitte warten...',
  };

  const displayTitle = title || defaultTitles[type];
  const displayMessage = message || defaultMessages[type];

  return (
    <Overlay onClick={type !== 'loading' ? onClose : undefined}>
      <Modal onClick={e => e.stopPropagation()}>
        <IconContainer $type={type}>
          {type === 'success' && (
            <SuccessIcon viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="22" />
              <path d="M15 25 L22 32 L35 18" />
            </SuccessIcon>
          )}
          {type === 'error' && <ErrorIcon />}
          {type === 'loading' && <LoadingIcon />}
        </IconContainer>
        
        <Title>{displayTitle}</Title>
        <Message>{displayMessage}</Message>
        
        {type !== 'loading' && (
          <Button $type={type} onClick={onClose}>
            {buttonText || (type === 'success' ? 'OK' : 'Schließen')}
          </Button>
        )}
      </Modal>
    </Overlay>
  );
}

export default FeedbackModal;

// ═══════════════════════════════════════════════════════════════════════════
// HOOK FOR EASY USAGE
// ═══════════════════════════════════════════════════════════════════════════

export function useFeedbackModal() {
  const [modalState, setModalState] = React.useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    autoClose: 0,
  });

  const showSuccess = (message, title, autoClose = 2500) => {
    setModalState({
      isOpen: true,
      type: 'success',
      title: title || 'Erfolgreich!',
      message,
      autoClose,
    });
  };

  const showError = (message, title) => {
    setModalState({
      isOpen: true,
      type: 'error',
      title: title || 'Fehler',
      message,
      autoClose: 0,
    });
  };

  const showLoading = (message, title) => {
    setModalState({
      isOpen: true,
      type: 'loading',
      title: title || 'Wird gespeichert...',
      message: message || 'Bitte warten...',
      autoClose: 0,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    modalState,
    showSuccess,
    showError,
    showLoading,
    closeModal,
    FeedbackModalComponent: () => (
      <FeedbackModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        autoClose={modalState.autoClose}
      />
    ),
  };
}
