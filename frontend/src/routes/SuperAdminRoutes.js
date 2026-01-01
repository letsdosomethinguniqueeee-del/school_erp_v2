import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SuperAdminDashboard from '../components/SuperAdmin/SuperAdminDashboard';
import UserManagement from '../components/SuperAdmin/UserManagement/UserManagement';
import UserRoles from '../components/SuperAdmin/UserRoles/User&Roles';
import FeesManagement from '../components/SuperAdmin/FeesManagement/FeesManagement';
import EnhancedFeesManagement from '../components/SuperAdmin/FeesManagement/EnhancedFeesManagement';
import SystemConfiguration from '../components/SuperAdmin/SystemConfiguration/SystemConfiguration';
import SecurityAccess from '../components/SuperAdmin/Security/SecurityAccess';
import ExaminationResultManagement from '../components/SuperAdmin/ExaminationResults/ExaminationResultManagement';

function SuperAdminRoutesContent({ user }) {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminDashboard user={user} />} />
      <Route path="user-management" element={<UserManagement user={user} />} />
      <Route path="user-roles" element={<UserRoles user={user} />} />
      <Route path="fees-management" element={<FeesManagement user={user} />} />
      <Route path="enhanced-fees-management" element={<EnhancedFeesManagement user={user} />} />
      <Route path="system-configuration" element={<SystemConfiguration user={user} />} />
      <Route path="security-access" element={<SecurityAccess user={user} />} />
      <Route path="examination-result-management" element={<ExaminationResultManagement user={user} />} />
    </Routes>
  );
}

function SuperAdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={['super-admin']}>
      <SuperAdminRoutesContent />
    </ProtectedRoute>
  );
}

export default SuperAdminRoutes;