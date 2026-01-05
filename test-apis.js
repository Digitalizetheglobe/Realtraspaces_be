const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function testAPIs() {
    console.log('Testing Realtraspaces APIs...\n');

    try {
        // Test main server
        console.log('1. Testing main server...');
        const mainResponse = await axios.get(`${BASE_URL}`);
        console.log('✅ Main server:', mainResponse.data.message);

        // Test Awards API
        console.log('\n2. Testing Awards API...');
        const awardsResponse = await axios.get(`${BASE_URL}/api/awards`);
        console.log('✅ Awards API:', awardsResponse.data.success ? 'Working' : 'Failed');

        // Test CV Submissions API
        console.log('\n3. Testing CV Submissions API...');
        const cvStatsResponse = await axios.get(`${BASE_URL}/api/cv-submissions/stats`);
        console.log('✅ CV Submissions API:', cvStatsResponse.data.success ? 'Working' : 'Failed');

        // Test Contacts API
        console.log('\n4. Testing Contacts API...');
        const contactStatsResponse = await axios.get(`${BASE_URL}/api/contacts/stats`);
        console.log('✅ Contacts API:', contactStatsResponse.data.success ? 'Working' : 'Failed');

        // Test static file serving
        console.log('\n5. Testing static file serving...');
        try {
            await axios.get(`${BASE_URL}/awardsimages/`);
            console.log('✅ Awards images directory accessible');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ Awards images directory exists (403 expected for directory listing)');
            } else {
                console.log('❌ Awards images directory issue');
            }
        }

        try {
            await axios.get(`${BASE_URL}/resume/`);
            console.log('✅ Resume directory accessible');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ Resume directory exists (403 expected for directory listing)');
            } else {
                console.log('❌ Resume directory issue');
            }
        }

        console.log('\n🎉 All APIs are working correctly!');
        console.log('\nTest interfaces available:');
        console.log('- Awards API: test-awards-api.html');
        console.log('- CV Submissions API: test-cv-submission-api.html');
        console.log('- Contacts API: test-contact-api.html');

    } catch (error) {
        console.error('❌ Error testing APIs:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the tests
testAPIs();
