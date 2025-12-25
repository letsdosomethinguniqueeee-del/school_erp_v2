require('dotenv').config();

console.log('Environment Variables Check:');
console.log('JWT_SECRET:', process.env.JWT_SECRET || 'NOT SET');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');

// Test JWT generation
const jwt = require('jsonwebtoken');

try {
  if (!process.env.JWT_SECRET) {
    console.log('\n❌ JWT_SECRET is not set!');
    console.log('This will cause authentication to fail.');
  } else {
    console.log('\n✅ JWT_SECRET is set');
    console.log('Length:', process.env.JWT_SECRET.length);
    
    // Test JWT generation
    const testToken = jwt.sign({ test: 'data' }, process.env.JWT_SECRET);
    console.log('JWT generation test: SUCCESS');
  }
} catch (error) {
  console.log('\n❌ JWT Error:', error.message);
}
