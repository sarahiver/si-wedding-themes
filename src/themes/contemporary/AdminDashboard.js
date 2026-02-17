// Contemporary AdminDashboard - Uses shared admin core with contemporary styles
import React from 'react';
import AdminShell from '../../components/admin/core/AdminShell';
import ContemporaryAdminComponents from '../../components/admin/styles/ContemporaryAdminStyles';

function AdminDashboard() {
  return (
    <AdminShell components={ContemporaryAdminComponents} />
  );
}

export default AdminDashboard;
