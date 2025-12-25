import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './routes/PublicRoute';
import Login from './components/Auth/Login/Login';
import NotFound from './components/Shared/NotFound/NotFound';
import SuperAdminRoutes from './routes/SuperAdminRoutes';
import AdminRoutes from './routes/AdminRoutes';
import TeacherRoutes from './routes/TeacherRoutes';
import StudentRoutes from './routes/StudentRoutes';
import ParentRoutes from './routes/ParentRoutes';
import StaffRoutes from './routes/StaffRoutes';

// Main App Component
function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute redirectForLogin={true}><Login /></PublicRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Role-based Routes - Each handles its own nested routes */}
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/teacher/*" element={<TeacherRoutes />} />
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/parent/*" element={<ParentRoutes />} />
          <Route path="/staff/*" element={<StaffRoutes />} />
          
          {/* Fallback - Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 