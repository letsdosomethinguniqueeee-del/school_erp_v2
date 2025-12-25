import api from '../config/axios';

/**
 * Shared logout utility function
 * Makes API call to logout endpoint - backend handles all session and cookie cleanup
 * 
 * @returns {Promise<void>}
 */
export const performLogout = async () => {
  try {
    // Make API call to logout endpoint - backend handles session and cookie cleanup
    await api.post('/api/auth/logout');
  } catch (error) {
    // Log error but don't throw - logout should proceed even if API call fails
    console.error('Logout API error:', error);
  }
};

