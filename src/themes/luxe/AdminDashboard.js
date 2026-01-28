// Luxe AdminDashboard - Uses shared admin core with Luxe styles
import React from 'react';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import AdminShell from '../../components/admin/core/AdminShell';
import { LuxeAdminComponents } from '../../components/admin/styles/LuxeAdminStyles';

function AdminDashboard({ onClose }) {
  return (
    <AdminProvider>
      <AdminShell 
        components={LuxeAdminComponents}
        onClose={onClose}
        themeName="luxe"
      />
    </AdminProvider>
  );
}

export default AdminDashboard;
