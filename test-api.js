const axios = require('axios');

async function testTestimonialsAPI() {
  try {
    console.log('Testing testimonials API...');

    // Test local API
    const localResponse = await axios.get('https://api.realtraspaces.com/api/testimonials');
    console.log('✅ Local API Response:', localResponse.status);
    console.log('✅ Local API Data:', localResponse.data);

  } catch (error) {
    console.error('❌ Error testing local API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }

  try {
    // Test production API
    const prodResponse = await axios.get('https://api.realtraspaces.com/api/testimonials');
    console.log('✅ Production API Response:', prodResponse.status);
    console.log('✅ Production API Data:', prodResponse.data);

  } catch (error) {
    console.error('❌ Error testing production API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testTestimonialsAPI();
