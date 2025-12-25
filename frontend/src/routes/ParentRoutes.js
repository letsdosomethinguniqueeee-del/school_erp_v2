import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ParentDashboard from '../components/Parent/Dashboard';

/**
 * Parent Routes Component
 * Handles all routes under /parent/*
 */
function ParentRoutes() {
  return (
    <ProtectedRoute allowedRoles={['parent']}>
      <Routes>
        <Route path="/" element={<ParentDashboard />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default ParentRoutes;
