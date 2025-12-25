const jwt = require('jsonwebtoken');

// Middleware: Authenticate user based on JWT token
exports.authenticate = (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Will have { id, role }
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware: Authenticate user based on JWT token
exports.adminAuthentication = (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Will have { id, role }
    console.log(req.user.role);
    if(req.user.role === "admin")
    { 
      next();
    }
    else {
      console.log('Access denied: Non-admin user tried to access admin route.');
      return res.status(403).json({ message: 'Admin access required' });
    }    

  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// Middleware: Authorize user based on role
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      console.log(`Access denied: User ${req.user?.id} with role ${req.user?.role} tried to access route requiring roles: ${allowedRoles.join(', ')}`);
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

// Middleware: Super Admin authentication
exports.superAdminAuthentication = (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Will have { id, role }
    
    // Check for super admin role (handle both variations)
    if (req.user.role === "super-admin" || req.user.role === "superadmin") {
      console.log(`Super Admin access granted to user ${req.user.id}`);
      next();
    } else {
      console.log(`Access denied: User ${req.user.id} with role ${req.user.role} tried to access super admin route`);
      return res.status(403).json({ message: 'Super Admin access required' });
    }

  } catch (err) {
    console.error('JWT verification failed for super admin route:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
