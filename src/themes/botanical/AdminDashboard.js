// AdminDashboard.js - Zen Theme
import React from 'react';
import { AdminShell } from '../../components/admin/core';
import { useWedding } from '../../context/WeddingContext';

function AdminDashboard() {
  const { weddingId, content, refreshData } = useWedding();
  
  return (
    <AdminShell
      weddingId={weddingId}
      content={content}
      refreshData={refreshData}
      theme="botanical"
    />
  );
}

export default AdminDashboard;
