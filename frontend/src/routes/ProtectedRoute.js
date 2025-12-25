import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import api from '../config/axios';
import Loader from '../components/Shared/Loader/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleSessionExpiry = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpired(true);
    
    // Fire and forget - don't await
    api.post('/api/auth/logout').catch(() => {});  // Silent fail
  };

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/check');
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setSessionExpired(false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setSessionExpired(false);
      }
    } catch (error) {
      // Extract error code, message, and reason from backend response
      const errorCode = error.response?.data?.errorCode;
      const message = error.response?.data?.message;
      const reason = error.response?.data?.reason;
      
      // Handle session expiry - show special UI
      if (errorCode === 'SESSION_EXPIRED') {
        await handleSessionExpiry();
      } 
      // Handle all other errors - show toast with message as title and reason as description
      else {
        toast({
          title: message || 'Authentication Failed',
          description: reason || 'Please log in again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setUser(null);
        setIsAuthenticated(false);
        setSessionExpired(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      await checkAuthStatus();
    };
    verifyAuthentication();
  }, [location.pathname]); // Re-check authentication when route changes

  if (loading) {
    return <Loader fullScreen={true} size="large" variant="primary" />;
  }

  if (sessionExpired) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h3 style={{ color: '#e74c3c', margin: 0 }}>Session Expired</h3>
        <p style={{ color: '#666', margin: 0 }}>Your session has expired. Please log in again.</p>
        <button 
          onClick={() => {
            navigate('/login');
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    toast({
      title: 'Access Denied',
      description: `You do not have permission to access this page. Required role: ${allowedRoles.join(' or ')}.`,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return <Navigate to="/login" replace />;
  }

  // All checks passed, render the protected content with user data
  return React.cloneElement(children, { user });
};

export default ProtectedRoute;