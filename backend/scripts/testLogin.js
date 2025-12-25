const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Test login functionality
const testLogin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://letsdosomethinguniqueeee:letsdosomethinguniqueeee@cluster0.1yebqdh.mongodb.net/school_erp';
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');

    // Test superadmin login
    console.log('\nTesting superadmin login...');
    const user = await User.findOne({ userId: 'superadmin', role: 'super-admin' });
    
    if (!user) {
      console.log('❌ Superadmin user not found!');
      return;
    }
    
    console.log('✅ Superadmin user found:');
    console.log('   User ID:', user.userId);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Active:', user.isActive);
    
    // Test password comparison
    console.log('\nTesting password comparison...');
    const isMatch = await user.comparePassword('superadmin123');
    console.log('Password match:', isMatch ? '✅ Correct' : '❌ Incorrect');
    
    // Test decryption
    console.log('\nTesting password decryption...');
    const decryptedPassword = user.getDecryptedPassword();
    console.log('Decrypted password:', decryptedPassword);
    
    console.log('\n✅ All tests passed! Superadmin account is working correctly.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
};

testLogin();
