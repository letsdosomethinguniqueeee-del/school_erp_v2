import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { performLogout as logoutAPI } from '../../../utils/logout';
import './Logout.css';

/**
 * Logout Component
 * 
 * This component handles the logout functionality.
 * It can be used as:
 * 1. A button component (default)
 * 2. A confirmation dialog before logout
 */
const Logout = ({ 
  showConfirmation = false, 
  buttonText = 'Logout',
  buttonClassName = '',
  onLogoutComplete,
  user = null
}) => {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    if (showConfirmation) {
      setShowConfirmDialog(true);
    } else {
      performLogout();
    }
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call shared logout utility - backend handles all cleanup
      await logoutAPI();
      
      if (onLogoutComplete) {
        onLogoutComplete();
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login even if there's an error
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  // If showing confirmation dialog
  if (showConfirmDialog) {
    return (
      <div className="logout-confirmation-overlay">
        <div className="logout-confirmation-dialog">
          <div className="logout-confirmation-header">
            <h3>Confirm Logout</h3>
          </div>
          <div className="logout-confirmation-body">
            <p>Are you sure you want to logout?</p>
            {user && (
              <p className="logout-user-info">
                Logging out as: <strong>{user.userId}</strong>
              </p>
            )}
          </div>
          <div className="logout-confirmation-actions">
            <button
              className="logout-btn-cancel"
              onClick={handleCancel}
              disabled={isLoggingOut}
            >
              Cancel
            </button>
            <button
              className="logout-btn-confirm"
              onClick={performLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: Simple logout button
  return (
    <button
      className={`logout-button ${buttonClassName}`}
      onClick={handleLogoutClick}
      disabled={isLoggingOut}
      title="Logout from your account"
    >
      {isLoggingOut ? (
        <span className="logout-loading">
          <span className="logout-spinner"></span>
          Logging out...
        </span>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {buttonText}
        </>
      )}
    </button>
  );
};

export default Logout;

