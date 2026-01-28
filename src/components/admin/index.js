// Admin System - Main Export
// ============================================
// This admin system separates LOGIC (core) from STYLING (styles)
// Each theme uses the same core logic with different styled-components

import React from 'react';
import AdminShell from './core/AdminShell';

// Import admin styles for each theme
import { BotanicalAdminComponents } from './styles/BotanicalAdminStyles';
import { EditorialAdminComponents } from './styles/EditorialAdminStyles';
import { ContemporaryAdminComponents } from './styles/ContemporaryAdminStyles';
import { LuxeAdminComponents } from './styles/LuxeAdminStyles';
import { NeonAdminComponents } from './styles/NeonAdminStyles';

// ============================================
// Core exports (for creating custom themes)
// ============================================
export { AdminProvider, useAdmin } from './core/AdminContext';
export { default as AdminShell } from './core/AdminShell';

// ============================================
// Ready-to-use Themed Admin Dashboards
// ============================================

// Botanical - Sage green, organic, nature-inspired
export function BotanicalAdmin() {
  return <AdminShell components={BotanicalAdminComponents} />;
}

// Editorial - Minimalist black/white magazine style
export function EditorialAdmin() {
  return <AdminShell components={EditorialAdminComponents} />;
}

// Contemporary - Warm neutrals, geometric, modern elegance
export function ContemporaryAdmin() {
  return <AdminShell components={ContemporaryAdminComponents} />;
}

// Luxe - Dark elegance, gold accents, premium feel
export function LuxeAdmin() {
  return <AdminShell components={LuxeAdminComponents} />;
}

// Neon - Bold dark theme with neon pink/cyan accents
export function NeonAdmin() {
  return <AdminShell components={NeonAdminComponents} />;
}

// Video theme uses Editorial style
export const VideoAdmin = EditorialAdmin;

// ============================================
// Style components exports (for customization)
// ============================================
export { BotanicalAdminComponents } from './styles/BotanicalAdminStyles';
export { EditorialAdminComponents } from './styles/EditorialAdminStyles';
export { ContemporaryAdminComponents } from './styles/ContemporaryAdminStyles';
export { LuxeAdminComponents } from './styles/LuxeAdminStyles';
export { NeonAdminComponents } from './styles/NeonAdminStyles';
