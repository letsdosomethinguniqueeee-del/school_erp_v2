import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '../components/Admin/Dashboard';
import ExaminationResultManagement from '../components/SuperAdmin/ExaminationResults/ExaminationResultManagement';

/**
 * Admin Routes Component
 * Handles all routes under /admin/*
 */
function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="examination-result-management" element={<ExaminationResultManagement />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default AdminRoutes;
