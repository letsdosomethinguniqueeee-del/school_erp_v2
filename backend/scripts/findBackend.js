const axios = require('axios');

// Common Render backend URL patterns
const possibleUrls = [
  'https://school-erp-backend.onrender.com',
  'https://school-erp-backend-qtpg.onrender.com',
  'https://school-erp-qtpg.onrender.com',
  'https://school-erp-backend-production.onrender.com'
];

// Common endpoints to test
const endpoints = ['/', '/api/health', '/api/debug/ip'];

async function testBackend() {
  console.log('🔍 Searching for your Render backend...\n');
  
  for (const baseUrl of possibleUrls) {
    console.log(`Testing: ${baseUrl}`);
    
    for (const endpoint of endpoints) {
      try {
        const url = baseUrl + endpoint;
        const response = await axios.get(url, { timeout: 10000 });
        
        console.log(`✅ FOUND: ${url}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
        console.log('');
        
        return { baseUrl, endpoint, status: response.status, data: response.data };
      } catch (error) {
        console.log(`❌ ${baseUrl}${endpoint} - ${error.response?.status || error.message}`);
      }
    }
    console.log('');
  }
  
  console.log('❌ No working backend found. Please check your Render deployment URL.');
  return null;
}

testBackend().then(result => {
  if (result) {
    console.log('🎯 Use this URL for load testing:');
    console.log(`BACKEND_URL=${result.baseUrl} npm run high-load-test`);
  }
}).catch(console.error);
