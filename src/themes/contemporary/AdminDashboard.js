// Contemporary AdminDashboard - Uses shared admin core with contemporary styles
import React from 'react';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import AdminShell from '../../components/admin/core/AdminShell';
import ContemporaryAdminComponents from '../../components/admin/styles/ContemporaryAdminStyles';

function AdminDashboard({ onClose }) {
  return (
    <AdminProvider>
      <AdminShell 
        components={ContemporaryAdminComponents}
        onClose={onClose}
        themeName="contemporary"
      />
    </AdminProvider>
  );
}

export default AdminDashboard;
