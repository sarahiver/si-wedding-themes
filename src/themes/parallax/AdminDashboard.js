// src/themes/parallax/AdminDashboard.js
// Parallax-themed Admin Dashboard — white/black, DM Sans, bold typography
import React from 'react';
import AdminShell from '../../components/admin/core/AdminShell';
import { ParallaxAdminComponents } from '../../components/admin/styles/ParallaxAdminStyles';

export default function ParallaxAdmin() {
  return <AdminShell components={ParallaxAdminComponents} />;
}
