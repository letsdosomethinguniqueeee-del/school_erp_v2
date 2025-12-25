import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCHOOL_CONFIG } from '../../../constants/school';
import Logout from '../../Auth/Logout/Logout';

const BaseDashboard = ({ title, children, role, user }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getRoleIcon = (role) => {
    const icons = {
      'admin': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      'super-admin': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
          <path d="M11 3L8 9l4 13 4-13-3-6"/>
          <path d="M2 9h20"/>
        </svg>
      ),
      'teacher': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      'student': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        </svg>
      ),
      'parent': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      'staff': (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      )
    };
    return icons[role] || (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    );
  };

  const getRoleName = (role) => {
    const names = {
      'admin': 'Administrator',
      'super-admin': 'Super Admin',
      'superadmin': 'Super Admin',
      'teacher': 'Teacher',
      'student': 'Student',
      'parent': 'Parent',
      'staff': 'Staff'
    };
    return names[role] || 'User';
  };

  const getRoleShortName = (role) => {
    const shortNames = {
      'admin': 'AD',
      'super-admin': 'SA',
      'superadmin': 'SA',
      'teacher': 'TE',
      'student': 'ST',
      'parent': 'PA',
      'staff': 'SF'
    };
    return shortNames[role] || 'US';
  };

  return (
    <div className="dashboard-container">
      {/* Professional Navigation Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="school-branding">
            <div className="school-logo">
              <div className="logo-placeholder">
                <span className="logo-icon">{SCHOOL_CONFIG.LOGO_TEXT}</span>
              </div>
            </div>
            <div className="school-info">
              <h1 className="school-name">{SCHOOL_CONFIG.NAME}</h1>
              <p className="school-tagline">{SCHOOL_CONFIG.TAGLINE}</p>
            </div>
          </div>
        </div>
        
        
        <div className="header-right">
          <div className="user-info" ref={userMenuRef}>
            <div className="user-profile" onClick={toggleUserMenu}>
              <div className="user-details">
                <div className="user-name">
                  <span className="user-name-full">{getRoleName(user?.role)}</span>
                  <span className="user-name-short">{getRoleShortName(user?.role)}</span>
                </div>
                <div className="user-id user-id-desktop">ID: {user?.userId}</div>
              </div>
              <div className="user-menu-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </div>
            </div>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-user-name">{getRoleName(user?.role)}</div>
                  <div className="dropdown-user-id">
                    <span className="user-id-full">ID: {user?.userId}</span>
                    <span className="user-id-truncated">ID: {user?.userId && user.userId.length > 12 ? `${user.userId.substring(0, 12)}...` : user?.userId}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Logout 
                  showConfirmation={true}
                  buttonText="Logout"
                  buttonClassName="dropdown-item"
                  user={user}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default BaseDashboard;
