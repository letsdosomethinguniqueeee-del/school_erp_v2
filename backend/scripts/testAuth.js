const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Test authentication logic
const testAuth = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://letsdosomethinguniqueeee:letsdosomethinguniqueeee@cluster0.1yebqdh.mongodb.net/school_erp';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');

    // Test the validation logic
    console.log('\nTesting userId validation...');
    
    const sanitizeInput = (input) => {
      if (typeof input !== 'string') return '';
      return input.trim().replace(/[<>\"'&]/g, '');
    };

    const isValidUserId = (userId, role) => {
      if (!userId || typeof userId !== 'string') return false;
      
      const sanitizedUserId = sanitizeInput(userId);
      
      // Allow alphanumeric usernames for students and super-admin
      if (role === 'student' || role === 'super-admin' || role === 'superadmin') {
        return /^[a-zA-Z0-9_-]{3,20}$/.test(sanitizedUserId);
      }
      
      // For other roles (admin, teacher, parent, staff), require mobile number format
      return /^[0-9]{10,15}$/.test(sanitizedUserId);
    };

    // Test cases
    const testCases = [
      { userId: 'superadmin', role: 'super-admin' },
      { userId: 'superadmin', role: 'superadmin' },
      { userId: 'admin001', role: 'admin' },
      { userId: 'student001', role: 'student' }
    ];

    testCases.forEach(test => {
      const isValid = isValidUserId(test.userId, test.role);
      console.log(`UserId: ${test.userId}, Role: ${test.role} -> Valid: ${isValid ? '✅' : '❌'}`);
    });

    // Test actual user lookup
    console.log('\nTesting user lookup...');
    const user = await User.findOne({ userId: 'superadmin', role: 'super-admin' });
    console.log('User found:', user ? '✅' : '❌');
    
    if (user) {
      console.log('User details:');
      console.log('  ID:', user._id);
      console.log('  UserId:', user.userId);
      console.log('  Role:', user.role);
      console.log('  Active:', user.isActive);
      
      // Test password
      const passwordMatch = await user.comparePassword('superadmin123');
      console.log('Password match:', passwordMatch ? '✅' : '❌');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

testAuth();
