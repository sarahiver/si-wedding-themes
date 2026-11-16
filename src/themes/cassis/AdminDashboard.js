// Kundendashboard des Themes: gemeinsamer Kern, Farben und Schriften des Cassis-Themes,
// dazu ein eigener Login im Aussehen der Antwortkarte.
import React from 'react';
import { AdminShell, CassisAdminComponents } from '../../components/admin';
import CassisLogin from './AdminLogin';

export default function CassisAdminDashboard() {
  return <AdminShell components={CassisAdminComponents} LoginComponent={CassisLogin} />;
}
