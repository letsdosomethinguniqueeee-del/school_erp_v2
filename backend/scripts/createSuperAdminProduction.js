const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Database connection for production
const connectDB = async () => {
  try {
    // Use the same MongoDB Atlas connection string as your production
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://letsdosomethinguniqueeee:letsdosomethinguniqueeee@cluster0.1yebqdh.mongodb.net/school_erp';
    console.log('Connecting to Production MongoDB Atlas...');
    console.log('Using URI:', mongoUri ? 'MongoDB Atlas' : 'Local MongoDB');
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
    console.log('Checking existing users...');
    const existingUsers = await User.find({});
    console.log(`Found ${existingUsers.length} existing users`);

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ userId: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('Superadmin already exists!');
      console.log('User ID: superadmin');
      console.log('Role:', existingSuperAdmin.role);
      console.log('Status:', existingSuperAdmin.isActive ? 'Active' : 'Inactive');
      process.exit(0);
    }

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
      const existingUser = await User.findOne({ userId: userData.userId });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.userId} (${userData.role})`);
      } else {
        console.log(`User ${userData.userId} already exists, skipping...`);
      }
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