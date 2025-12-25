import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import StudentDashboard from '../components/Student/Dashboard';
import StudentExamResults from '../components/Student/StudentExamResults';

/**
 * Student Routes Component
 * Handles all routes under /student/*
 */
function StudentRoutes() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="exam-results" element={<StudentExamResults />} />
      </Routes>
    </ProtectedRoute>
  );
}

export default StudentRoutes;
