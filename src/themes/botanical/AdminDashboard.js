import React from 'react';
import { AdminShell } from '../../components/admin/core';
import { BotanicalAdminStyles } from '../../components/admin/styles/BotanicalAdminStyles';

function AdminDashboard() {
  return (
    <BotanicalAdminStyles>
      <AdminShell themeName="botanical" />
    </BotanicalAdminStyles>
  );
}

export default AdminDashboard;
