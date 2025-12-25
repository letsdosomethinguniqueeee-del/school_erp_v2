const axios = require('axios');

// Test production login
const testProductionLogin = async () => {
  try {
    const productionUrl = 'https://school-erp-backend-i9z5.onrender.com';
    
    console.log('Testing production server...');
    
    // Test 1: Check if server is running
    console.log('\n1. Testing server status...');
    try {
      const debugResponse = await axios.get(`${productionUrl}/debug`);
      console.log('✅ Server is running');
      console.log('Debug info:', debugResponse.data);
    } catch (error) {
      console.log('❌ Server debug failed:', error.message);
    }
    
    // Test 2: Test login endpoint
    console.log('\n2. Testing login endpoint...');
    try {
      const loginResponse = await axios.post(`${productionUrl}/debug-login`, {
        userId: 'superadmin',
        password: 'superadmin123',
        role: 'super-admin'
      });
      console.log('✅ Login test successful');
      console.log('Response:', loginResponse.data);
    } catch (error) {
      console.log('❌ Login test failed:', error.response?.data || error.message);
    }
    
    // Test 3: Test actual auth endpoint
    console.log('\n3. Testing actual auth endpoint...');
    try {
      const authResponse = await axios.post(`${productionUrl}/api/auth/login`, {
        userId: 'superadmin',
        password: 'superadmin123',
        role: 'super-admin'
      });
      console.log('✅ Auth endpoint successful');
      console.log('Response:', authResponse.data);
    } catch (error) {
      console.log('❌ Auth endpoint failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testProductionLogin();
