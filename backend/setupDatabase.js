const mongoose = require('mongoose');
const { seedFeeData } = require('./seeders/feeSeeder');

require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up MongoDB database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create indexes for better performance
    console.log('📊 Creating database indexes...');
    
    // Fee Structure indexes
    await mongoose.connection.db.collection('fees').createIndex({ SessionYear: 1, Class: 1 });
    await mongoose.connection.db.collection('fees').createIndex({ SessionYear: 1 });
    
    // Student indexes for better performance
    await mongoose.connection.db.collection('students').createIndex({ rollNo: 1, currentStudyClass: 1 });
    await mongoose.connection.db.collection('students').createIndex({ studentId: 1 });
    await mongoose.connection.db.collection('students').createIndex({ currentStudyClass: 1 });
    
    // Transaction indexes
    await mongoose.connection.db.collection('transactions').createIndex({ studentId: 1, sessionYear: 1 });
    await mongoose.connection.db.collection('transactions').createIndex({ sessionYear: 1 });
    await mongoose.connection.db.collection('transactions').createIndex({ date: -1 });
    
    console.log('✅ Database indexes created successfully!');
    
    // Seed sample data
    console.log('🌱 Seeding sample data...');
    const result = await seedFeeData();
    
    console.log('🎉 Database setup completed successfully!');
    console.log(`📈 Created ${result.feeStructures} fee structures and ${result.transactions} transactions`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
