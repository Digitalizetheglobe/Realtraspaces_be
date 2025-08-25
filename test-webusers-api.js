const fetch = require('node-fetch');

// Test the GET /api/webusers endpoint
async function testWebUsersAPI() {
  try {
    console.log('🧪 Testing WebUsers API...\n');
    
    const response = await fetch('https://api.realtraspaces.com/api/webusers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response Status: ${response.status}`);
    console.log(`📡 Response Headers:`, response.headers.raw());

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API Response:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.status === 'success') {
        console.log(`\n📊 Total Users: ${data.count}`);
        console.log(`📊 Users Data Length: ${data.data.length}`);
        
        if (data.data.length > 0) {
          console.log('\n👤 Sample User Data:');
          console.log(JSON.stringify(data.data[0], null, 2));
        }
      }
    } else {
      const errorText = await response.text();
      console.log('\n❌ Error Response:');
      console.log(errorText);
    }
  } catch (error) {
    console.error('\n💥 Test Failed:', error.message);
  }
}

// Instructions for testing
console.log('🚀 WebUsers API Test Script');
console.log('================================');
console.log('To test this API:');
console.log('1. Run: node test-webusers-api.js');
console.log('2. Check the response for successful data retrieval\n');

// Run the test
testWebUsersAPI();

module.exports = { testWebUsersAPI };
