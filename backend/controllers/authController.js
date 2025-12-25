const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>\"'&]/g, '');
};

// Helper: Role-based userId validation
const isValidUserId = (userId, role) => {
  if (!userId || typeof userId !== 'string') return false;
  
  const sanitizedUserId = sanitizeInput(userId);
  
  // Allow alphanumeric usernames for students and super-admin
  if (role === 'student' || role === 'super-admin' || role === 'admin') {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(sanitizedUserId);
  }
  
  // For other roles (teacher, parent, staff), require 10-digit mobile number format
  return /^[0-9]{10}$/.test(sanitizedUserId);
};

// Generate JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '1d' }
  );
};


//
// Login using password
//
exports.loginWithPassword = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    // Input validation
    if (!userId || !password || !role) {
      return res.status(400).json({ message: 'userId, password, and role are required.' });
    }

    // Sanitize inputs
    const sanitizedUserId = sanitizeInput(userId);
    const sanitizedRole = sanitizeInput(role);

    // Validate role
    const validRoles = ['admin', 'super-admin', 'teacher', 'student', 'parent', 'staff'];
    if (!validRoles.includes(sanitizedRole)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    // Validate userId format
    const isValid = isValidUserId(sanitizedUserId, sanitizedRole);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid userId format for this role.' });
    }

    // Find user
    console.log('Looking for user with:', { userId: sanitizedUserId, role: sanitizedRole });
    const user = await User.findOne({ userId: sanitizedUserId, role: sanitizedRole });
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'Invalid UserID.' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Please contact administrator.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Lax for localhost
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Lax for localhost
      path: '/'
    });
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

// Check authentication status
exports.checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.token;
    
    // when token is not found, return 401 with error code and reason
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication required',
        errorCode: 'NOT_AUTHENTICATED',
        reason: 'Please log in to continue'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Account not found',
        errorCode: 'USER_NOT_FOUND',
        reason: 'Your account may have been deleted. Please contact administrator.'
      });
    }
    
    res.status(200).json({ user: user.toJSON() });
  } catch (error) {
    // Handle token expiration - check both name and message for reliability
    if (error.name === 'TokenExpiredError' || error.message === 'jwt expired') {
      return res.status(401).json({ 
        message: 'Session expired',
        errorCode: 'SESSION_EXPIRED',
        reason: 'Your session has expired. Please log in again.'
      });
    }
    
    // Log all other errors for debugging but show generic message to user
    console.error('Auth check error:', { name: error.name, message: error.message });
    return res.status(401).json({ 
      message: 'Authentication failed',
      errorCode: 'AUTH_ERROR',
      reason: 'Please log in again.'
    });
  }
};
