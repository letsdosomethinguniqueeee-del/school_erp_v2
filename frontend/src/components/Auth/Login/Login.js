import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../config/axios';
import { USER_ROLES, ROLE_DISPLAY_NAMES, ROLE_PLACEHOLDERS } from '../../../constants/roles';
import { SCHOOL_CONFIG } from '../../../constants/school';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    role: ''
  });
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const roles = [
    { id: USER_ROLES.ADMIN, name: ROLE_DISPLAY_NAMES[USER_ROLES.ADMIN], icon: '👨‍💼', description: 'School Administration' },
    { id: USER_ROLES.SUPER_ADMIN, name: ROLE_DISPLAY_NAMES[USER_ROLES.SUPER_ADMIN], icon: '👑', description: 'System Management' },
    { id: USER_ROLES.TEACHER, name: ROLE_DISPLAY_NAMES[USER_ROLES.TEACHER], icon: '👨‍🏫', description: 'Faculty Access' },
    { id: USER_ROLES.STUDENT, name: ROLE_DISPLAY_NAMES[USER_ROLES.STUDENT], icon: '👨‍🎓', description: 'Student Portal' },
    { id: USER_ROLES.PARENT, name: ROLE_DISPLAY_NAMES[USER_ROLES.PARENT], icon: '👨‍👩‍👧‍👦', description: 'Parent Portal' },
    { id: USER_ROLES.STAFF, name: ROLE_DISPLAY_NAMES[USER_ROLES.STAFF], icon: '👨‍💻', description: 'Staff Access' }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setFormData(prev => ({ ...prev, role: roleId }));
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.password || !formData.role) {
      setError('Please fill in all fields and select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Make direct API call to login endpoint
      const response = await api.post('/api/auth/login', {
        userId: formData.userId,
        password: formData.password,
        role: formData.role
      });
      
      if (response.data.user) {
        // Login successful - navigate based on role
        const roleRoutes = {
          'admin': '/admin',
          'super-admin': '/super-admin',
          'teacher': '/teacher',
          'student': '/student',
          'parent': '/parent',
          'staff': '/staff'
        };
        
        navigate(roleRoutes[formData.role]);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* School Header - Top */}
      <div className="school-header-top">
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

      {/* Login Section */}
      <div className="login-section">
        <div className="login-card">
          <div className="login-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access the system</p>
          </div>
          
          <div className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Role Selection - Clean Buttons */}
              <div className="form-group">
                <label className="role-label">I am a</label>
                <div className="role-buttons">
                  {roles.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      className={`role-btn ${formData.role === role.id ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, role: role.id }));
                        setSelectedRole(role.id);
                        setError('');
                      }}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* User ID Input */}
              <div className="form-group">
                <label htmlFor="userId">
                  {selectedRole === 'student' ? 'Student ID' : 
                   selectedRole === 'super-admin' ? 'Username' : 
                   selectedRole === 'teacher' ? 'Employee ID' :
                   selectedRole === 'parent' ? 'Parent ID' :
                   selectedRole === 'staff' ? 'Staff ID' :
                   selectedRole === 'admin' ? 'Admin ID' :
                   'User ID'}
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder={
                    selectedRole === 'student' ? 'Enter your student ID' : 
                    selectedRole === 'super-admin' ? 'Enter your username' : 
                    selectedRole === 'teacher' ? 'Enter your employee ID' :
                    selectedRole === 'parent' ? 'Enter your parent ID' :
                    selectedRole === 'staff' ? 'Enter your staff ID' :
                    selectedRole === 'admin' ? 'Enter your admin ID' :
                    'Enter your user ID'
                  }
                  required
                />
              </div>

              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="password-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className={`password-icon ${showPassword ? 'password-icon--hidden' : 'password-icon--visible'}`}>
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="login-btn" 
                disabled={loading || !formData.role}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100%' }}>
                    <div className="loading-spinner"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="login-footer">
              <a href="#" className="footer-link">Forgot Password?</a>
              <span className="footer-separator">•</span>
              <a href="#" className="footer-link">Need Help?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
