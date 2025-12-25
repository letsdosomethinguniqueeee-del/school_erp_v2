const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Database connection for production MongoDB Atlas
const connectDB = async () => {
  try {
    // Use the production MongoDB Atlas connection string
    const mongoUri = 'mongodb+srv://letsdosomethinguniqueeee:letsdosomethinguniqueeee@cluster0.1yebqdh.mongodb.net/school_erp';
    console.log('Connecting to Production MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create superadmin account for production
const createSuperAdmin = async () => {
  try {
    console.log('Checking existing users in production database...');
    const existingUsers = await User.find({});
    console.log(`Found ${existingUsers.length} existing users in production`);
    
    // List all users
    existingUsers.forEach(user => {
      console.log(`- ${user.userId} (${user.role}) - ${user.isActive ? 'Active' : 'Inactive'}`);
    });

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ userId: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('\nSuperadmin already exists in production!');
      console.log('User ID:', existingSuperAdmin.userId);
      console.log('Role:', existingSuperAdmin.role);
      console.log('Status:', existingSuperAdmin.isActive ? 'Active' : 'Inactive');
      
      // Test password
      const passwordMatch = await existingSuperAdmin.comparePassword('superadmin123');
      console.log('Password test:', passwordMatch ? '✅ Correct' : '❌ Incorrect');
      
      if (!passwordMatch) {
        console.log('\nUpdating superadmin password...');
        existingSuperAdmin.password = 'superadmin123';
        await existingSuperAdmin.save();
        console.log('✅ Password updated successfully');
      }
    } else {
      console.log('\nCreating superadmin account in production...');
      const superAdmin = new User({
        userId: 'superadmin',
        name: 'Super Admin',
        password: 'superadmin123',
        role: 'super-admin',
        isActive: true
      });

      await superAdmin.save();
      console.log('✅ Superadmin account created successfully in production!');
    }

    console.log('\n✅ Production database is ready!');
    console.log('You can now login with:');
    console.log('- User ID: superadmin');
    console.log('- Password: superadmin123');
    console.log('- Role: super-admin');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await createSuperAdmin();
};

runScript();
