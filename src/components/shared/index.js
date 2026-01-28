// src/components/shared/index.js
// Export all shared components and hooks

// Feedback/UI
export { default as FeedbackModal, useFeedbackModal } from './FeedbackModal';

// Core hooks for interactive features
export { usePhotoUpload, HiddenFileInput } from './PhotoUploadCore';
export { useGuestbook } from './GuestbookCore';
export { useMusicWishes } from './MusicWishesCore';
export { useGifts } from './GiftsCore';
export { useRSVP } from './RSVPCore';
