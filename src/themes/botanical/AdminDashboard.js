import React from 'react';
import styled from 'styled-components';
import { AdminShell } from '../../components/admin/core';

const BotanicalAdminWrapper = styled.div`
  --forest: #2D3B2D;
  --sage: #8B9D83;
  --sage-dark: #6B7D63;
  --sage-light: rgba(139, 157, 131, 0.3);
  --sage-muted: rgba(139, 157, 131, 0.15);
  --cream: #F9F6F2;
  --cream-dark: #EDE9E3;
  --text: #2D3B2D;
  --text-light: #5A6B5A;
  --text-muted: #8A9B8A;
  
  min-height: 100vh;
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif;
`;

function AdminDashboard() {
  return (
    <BotanicalAdminWrapper>
      <AdminShell themeName="botanical" />
    </BotanicalAdminWrapper>
  );
}

export default AdminDashboard;
