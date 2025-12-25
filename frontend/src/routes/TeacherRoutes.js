import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import TeacherDashboard from '../components/Teacher/Dashboard';
import ExaminationResultManagement from '../components/SuperAdmin/ExaminationResults/ExaminationResultManagement';

/**
 * Teacher Routes Component
 * Handles all routes under /teacher/*
 */
function TeacherRoutes() {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <Routes>
        <Route path="/" element={<TeacherDashboard />} />
        <Route path="examination-result-management" element={<ExaminationResultManagement />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default TeacherRoutes;
