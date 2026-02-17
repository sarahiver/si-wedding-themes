import React from 'react';
import AdminShell from '../../components/admin/core/AdminShell';
import { LuxeAdminComponents } from '../../components/admin/styles/LuxeAdminStyles';

function AdminDashboard() {
  return (
    <AdminShell components={LuxeAdminComponents} />
  );
}

export default AdminDashboard;
