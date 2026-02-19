// src/themes/parallax/AdminDashboard.js
// Parallax-themed Admin Dashboard — white/black, DM Sans, bold typography
import React, { useEffect } from 'react';
import AdminShell from '../../components/admin/core/AdminShell';
import { ParallaxAdminComponents } from '../../components/admin/styles/ParallaxAdminStyles';

export default function ParallaxAdmin() {
  // Override parallax GlobalStyles that sets overflow:hidden + fixed #root on body/html
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const root = document.getElementById('root')
    html.style.overflow = 'auto'
    html.style.height = 'auto'
    body.style.overflow = 'auto'
    body.style.height = 'auto'
    if (root) {
      root.style.position = 'static'
      root.style.width = 'auto'
      root.style.height = 'auto'
    }
    return () => {
      html.style.overflow = ''
      html.style.height = ''
      body.style.overflow = ''
      body.style.height = ''
      if (root) {
        root.style.position = ''
        root.style.width = ''
        root.style.height = ''
      }
    }
  }, [])

  return <AdminShell components={ParallaxAdminComponents} />;
}
