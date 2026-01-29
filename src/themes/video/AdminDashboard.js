// Video Theme - Uses shared AdminDashboard
import React from 'react';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import AdminShell from '../../components/admin/core/AdminShell';
import styled from 'styled-components';

// Video Theme styling for admin
const VideoAdminWrapper = styled.div`
  --admin-bg: #1A1A1A;
  --admin-card-bg: #252525;
  --admin-border: rgba(255,255,255,0.1);
  --admin-text: #FFFFFF;
  --admin-text-muted: #888888;
  --admin-accent: #6B8CAE;
  
  background: var(--admin-bg);
  min-height: 100vh;
  color: var(--admin-text);
  font-family: 'Inter', sans-serif;
`;

function AdminDashboard({ onClose }) {
  return (
    <VideoAdminWrapper>
      <AdminProvider>
        <AdminShell onClose={onClose} />
      </AdminProvider>
    </VideoAdminWrapper>
  );
}

export default AdminDashboard;
