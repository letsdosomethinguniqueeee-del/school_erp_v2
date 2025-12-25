const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Starting School ERP Backend Server...\n');

// Check environment variables
if (!process.env.MONGO_URI) {
  console.log('❌ Error: MONGO_URI not found in environment variables');
  console.log('💡 Please create a .env file with your MongoDB connection string');
  console.log('   Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school_erp');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('📡 MongoDB URI:', process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  console.log('🎉 Backend server is ready to start!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm run dev (for development)');
  console.log('   2. Or run: npm start (for production)');
  console.log('   3. Server will be available at: http://localhost:5000');
  process.exit(0);
}).catch(err => {
  console.log('❌ MongoDB connection failed:', err.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   - Check your MongoDB connection string');
  console.log('   - Ensure MongoDB Atlas cluster is running');
  console.log('   - Verify network access in MongoDB Atlas');
  console.log('   - Check if your IP is whitelisted');
  process.exit(1);
});
