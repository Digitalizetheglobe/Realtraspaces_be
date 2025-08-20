const fetch = require('node-fetch');

// Test the PATCH /api/webusers/:id/status endpoint
async function testUpdateUserStatus() {
  try {
    console.log('🧪 Testing Update User Status API...\n');
    
    // You'll need to replace these with valid values
    const adminToken = 'YOUR_ADMIN_TOKEN_HERE';
    const userId = 1; // Replace with actual user ID
    
    console.log(`📡 Testing status update for user ID: ${userId}`);
    
    // Test 1: Deactivate user
    console.log('\n🔄 Test 1: Deactivating user...');
    const deactivateResponse = await fetch(`https://api.realtraspaces.com/api/webusers/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isActive: false
      }),
    });

    console.log(`📡 Deactivate Response Status: ${deactivateResponse.status}`);
    
    if (deactivateResponse.ok) {
      const deactivateData = await deactivateResponse.json();
      console.log('✅ Deactivate Response:');
      console.log(JSON.stringify(deactivateData, null, 2));
    } else {
      const errorText = await deactivateResponse.text();
      console.log('❌ Deactivate Error Response:');
      console.log(errorText);
    }

    // Wait a moment before next test
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 2: Activate user
    console.log('\n🔄 Test 2: Activating user...');
    const activateResponse = await fetch(`https://api.realtraspaces.com/api/webusers/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isActive: true
      }),
    });

    console.log(`📡 Activate Response Status: ${activateResponse.status}`);
    
    if (activateResponse.ok) {
      const activateData = await activateResponse.json();
      console.log('✅ Activate Response:');
      console.log(JSON.stringify(activateData, null, 2));
    } else {
      const errorText = await activateResponse.text();
      console.log('❌ Activate Error Response:');
      console.log(errorText);
    }

  } catch (error) {
    console.error('\n💥 Test Failed:', error.message);
  }
}

// Instructions for testing
console.log('🚀 Update User Status API Test Script');
console.log('=====================================');
console.log('To test this API:');
console.log('1. Replace YOUR_ADMIN_TOKEN_HERE with a valid admin JWT token');
console.log('2. Replace userId with an actual user ID from your database');
console.log('3. Run: node test-update-user-status.js');
console.log('4. Check the response for successful status updates\n');

// Uncomment the line below to run the test
// testUpdateUserStatus();

module.exports = { testUpdateUserStatus };
