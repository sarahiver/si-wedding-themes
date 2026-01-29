import React from 'react';
import { AdminProvider } from '../../components/admin/core/AdminContext';
import AdminShell from '../../components/admin/core/AdminShell';
import { BotanicalAdminComponents } from '../../components/admin/styles/BotanicalAdminStyles';

function AdminDashboard({ onClose }) {
  return (
    <AdminProvider>
      <AdminShell components={BotanicalAdminComponents} onClose={onClose} themeName="botanical" />
    </AdminProvider>
  );
}

export default AdminDashboard;
