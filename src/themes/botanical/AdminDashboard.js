// AdminDashboard.js - Botanical Glass Theme Admin
import React from 'react';
import { AdminShell } from '../../components/admin/core';
import { BotanicalGlassAdminComponents, AdminGlobalStyles, BotanicalGlassAdminWrapper } from './BotanicalGlassAdminStyles';

function AdminDashboard() {
  return (
    <>
      <AdminGlobalStyles />
      <BotanicalGlassAdminWrapper>
        <AdminShell components={BotanicalGlassAdminComponents} />
      </BotanicalGlassAdminWrapper>
    </>
  );
}

export default AdminDashboard;
