import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import StaffDashboard from '../components/Staff/Dashboard';

/**
 * Staff Routes Component
 * Handles all routes under /staff/*
 */
function StaffRoutes() {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <Routes>
        <Route path="/" element={<StaffDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default StaffRoutes;
