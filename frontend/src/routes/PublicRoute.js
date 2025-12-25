import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../config/axios';
import Loader from '../components/Shared/Loader/Loader';

const PublicRoute = ({ children, redirectForLogin = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/check');
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      await checkAuthStatus();
    };
    verifyAuthentication();
  }, []);

  if (loading) {
    return <Loader fullScreen={true} size="large" variant="primary" />;
  }

  // If redirectForLogin is true and user is authenticated, redirect to dashboard
  if (redirectForLogin && user) {
    const roleRoutes = {
      'admin': '/admin',
      'super-admin': '/super-admin',
      'teacher': '/teacher',
      'student': '/student',
      'parent': '/parent',
      'staff': '/staff'
    };
    
    const dashboardRoute = roleRoutes[user.role];
    if (dashboardRoute) {
      return <Navigate to={dashboardRoute} replace />;
    }
  }

  return React.cloneElement(children, { user });
};

export default PublicRoute;