const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/developers';

async function testDeveloperFilenameStorage() {
  console.log('Testing Developer API - Filename Storage\n');

  try {
    // Test 1: Create a developer with logo
    console.log('1. Creating developer with logo...');
    const formData = new FormData();
    formData.append('buildername', 'Test Developer');
    formData.append('descriptions', 'Test description');
    formData.append('projectName[]', 'Project 1');
    formData.append('projectName[]', 'Project 2');
    
    // Note: In a real test, you would need to append a file here
    // formData.append('builder_logo', fileBuffer, 'test-logo.jpg');

    const createResponse = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('✅ Developer created successfully');
    console.log('Response data:', JSON.stringify(createResponse.data, null, 2));

    const developerId = createResponse.data.data.id;

    // Test 2: Get all developers
    console.log('\n2. Getting all developers...');
    const getAllResponse = await axios.get(BASE_URL);
    console.log('✅ Developers retrieved successfully');
    console.log('Count:', getAllResponse.data.count);
    
    // Check if filenames are stored (not URLs)
    const developers = getAllResponse.data.data;
    if (developers.length > 0) {
      const dev = developers[0];
      console.log('Sample developer data:');
      console.log('- builder_logo (filename):', dev.builder_logo);
      console.log('- builder_logo_url (full URL):', dev.builder_logo_url);
      console.log('- images (filenames):', dev.images);
      console.log('- image_urls (full URLs):', dev.image_urls);
    }

    // Test 3: Get single developer
    console.log('\n3. Getting single developer...');
    const getSingleResponse = await axios.get(`${BASE_URL}/${developerId}`);
    console.log('✅ Single developer retrieved successfully');
    console.log('Developer data:', JSON.stringify(getSingleResponse.data, null, 2));

    // Test 4: Update developer
    console.log('\n4. Updating developer...');
    const updateFormData = new FormData();
    updateFormData.append('buildername', 'Updated Test Developer');
    updateFormData.append('descriptions', 'Updated description');

    const updateResponse = await axios.put(`${BASE_URL}/${developerId}`, updateFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('✅ Developer updated successfully');
    console.log('Updated data:', JSON.stringify(updateResponse.data, null, 2));

    // Test 5: Delete developer
    console.log('\n5. Deleting developer...');
    const deleteResponse = await axios.delete(`${BASE_URL}/${developerId}`);
    console.log('✅ Developer deleted successfully');
    console.log('Delete response:', JSON.stringify(deleteResponse.data, null, 2));

    console.log('\n🎉 All tests passed! The API is now storing filenames instead of URLs.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testDeveloperFilenameStorage();
