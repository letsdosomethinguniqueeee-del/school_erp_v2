const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/school_erp';
    console.log('Connecting to MongoDB...');
    console.log('Using URI:', mongoUri ? 'MongoDB Atlas' : 'Local MongoDB');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create superadmin account
const createSuperAdmin = async () => {
  try {
    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('All existing users cleared');

    console.log('Creating superadmin account...');
    const superAdmin = new User({
      userId: 'superadmin',
      name: 'Super Admin',
      password: 'superadmin123',
      role: 'super-admin',
      isActive: true
    });

    await superAdmin.save();
    console.log('Superadmin account created successfully!');
    console.log('User ID: superadmin');
    console.log('Password: superadmin123');
    console.log('Role: super-admin');

    // Create some dummy users for testing
    const dummyUsers = [
      {
        userId: 'admin001',
        name: 'John Admin',
        password: 'admin123',
        role: 'admin',
        isActive: true
      },
      {
        userId: 'student001',
        name: 'Alice Student',
        password: 'student123',
        role: 'student',
        isActive: true
      },
      {
        userId: 'teacher001',
        name: 'Dr. Smith Teacher',
        password: 'teacher123',
        role: 'teacher',
        isActive: true
      },
      {
        userId: 'staff001',
        name: 'Mike Staff',
        password: 'staff123',
        role: 'staff',
        isActive: true
      }
    ];

    console.log('Creating dummy users...');
    for (const userData of dummyUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.userId} (${userData.role})`);
    }

    console.log('All users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await createSuperAdmin();
};

runScript();
