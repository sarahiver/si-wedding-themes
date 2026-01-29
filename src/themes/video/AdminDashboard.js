// Video Theme - AdminDashboard with VideoAdminStyles
import React from 'react';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import AdminShell from '../../components/admin/core/AdminShell';
import * as VideoAdminStyles from '../../components/admin/styles/VideoAdminStyles';

function AdminDashboard({ onClose }) {
  return (
    <AdminProvider>
      <AdminShell 
        onClose={onClose} 
        components={VideoAdminStyles}
      />
    </AdminProvider>
  );
}

export default AdminDashboard;
