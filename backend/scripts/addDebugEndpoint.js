const fs = require('fs');
const path = require('path');

// Read the current server.js
const serverPath = path.join(__dirname, '..', 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Add debug endpoint before the existing routes
const debugEndpoint = `
// Debug endpoint for production testing
app.get('/debug', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasMongoUri: !!process.env.MONGO_URI,
    corsOrigin: process.env.NODE_ENV === 'production' 
      ? 'https://school-erp-qtpg.vercel.app'
      : 'http://localhost:3000'
  });
});

// Test login endpoint
app.post('/debug-login', async (req, res) => {
  try {
    const { userId, password, role } = req.body;
    
    // Find user
    const User = require('./models/User');
    const user = await User.findOne({ userId, role });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        searched: { userId, role }
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    res.json({
      userFound: !!user,
      passwordMatch: isMatch,
      userDetails: {
        id: user._id,
        userId: user.userId,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

`;

// Find where to insert the debug endpoint (before the existing routes)
const routesIndex = serverContent.indexOf('// Routes');
if (routesIndex !== -1) {
  serverContent = serverContent.slice(0, routesIndex) + debugEndpoint + serverContent.slice(routesIndex);
} else {
  // If no routes section found, add before the server start
  const serverStartIndex = serverContent.indexOf('app.listen');
  if (serverStartIndex !== -1) {
    serverContent = serverContent.slice(0, serverStartIndex) + debugEndpoint + serverContent.slice(serverStartIndex);
  }
}

// Write the updated server.js
fs.writeFileSync(serverPath, serverContent);
console.log('Debug endpoints added to server.js');
console.log('You can now test:');
console.log('1. GET /debug - Check server status');
console.log('2. POST /debug-login - Test login with { userId, password, role }');
