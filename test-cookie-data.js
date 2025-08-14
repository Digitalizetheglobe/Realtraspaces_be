// Simple test script to add sample cookie policy data
// Run this in the browser console or use a tool like Postman

const API_BASE_URL = 'https://api.realtraspaces.com';

// Sample data for testing
const sampleData = [
  {
    sessionId: 'test_session_001',
    policyVersion: '1.0'
  },
  {
    sessionId: 'test_session_002',
    policyVersion: '1.0'
  },
  {
    sessionId: 'test_session_003',
    policyVersion: '1.0'
  },
  {
    sessionId: 'test_session_004',
    policyVersion: '1.0'
  },
  {
    sessionId: 'test_session_005',
    policyVersion: '1.0'
  }
];

async function addSampleData() {
  console.log('Adding sample cookie policy data...');
  
  for (let i = 0; i < sampleData.length; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cookie-policy/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData[i])
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Sample data ${i + 1} added successfully:`, result.message);
      } else {
        console.log(`❌ Failed to add sample data ${i + 1}:`, response.status);
      }
    } catch (error) {
      console.log(`❌ Error adding sample data ${i + 1}:`, error.message);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\nSample data addition completed!');
  console.log('You can now visit the dashboard to see the data.');
}

// Instructions for running this script:
console.log('To add sample data, run this in your browser console:');
console.log('1. Open your browser developer tools (F12)');
console.log('2. Go to the Console tab');
console.log('3. Copy and paste the addSampleData() function above');
console.log('4. Run: addSampleData()');

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.addSampleData = addSampleData;
}
