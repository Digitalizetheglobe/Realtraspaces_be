const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://api.realtraspaces.com/api/developers';

// Test creating a developer with logo
async function testCreateDeveloper() {
  console.log('Testing developer creation...');

  const formData = new FormData();
  formData.append('buildername', 'Test Developer');
  formData.append('descriptions', 'A test developer for image testing');
  formData.append('project_name', JSON.stringify(['Project 1', 'Project 2']));

  // Add a logo file if you have one
  // formData.append('builder_logo', fs.createReadStream('./test-logo.png'));

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Create Developer Result:', result);
    return result.data.id;
  } catch (error) {
    console.error('Error creating developer:', error);
  }
}

// Test uploading multiple images
async function testUploadImages(developerId) {
  console.log(`Testing image upload for developer ${developerId}...`);

  const formData = new FormData();

  // Add multiple image files if you have them
  // formData.append('images', fs.createReadStream('./test-image1.jpg'));
  // formData.append('images', fs.createReadStream('./test-image2.jpg'));
  // formData.append('images', fs.createReadStream('./test-image3.jpg'));

  try {
    const response = await fetch(`${BASE_URL}/${developerId}/images`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Upload Images Result:', result);
  } catch (error) {
    console.error('Error uploading images:', error);
  }
}

// Test getting all developers
async function testGetAllDevelopers() {
  console.log('Testing get all developers...');

  try {
    const response = await fetch(BASE_URL);
    const result = await response.json();
    console.log('Get All Developers Result:', result);
  } catch (error) {
    console.error('Error getting developers:', error);
  }
}

// Test getting a specific developer
async function testGetDeveloper(developerId) {
  console.log(`Testing get developer ${developerId}...`);

  try {
    const response = await fetch(`${BASE_URL}/${developerId}`);
    const result = await response.json();
    console.log('Get Developer Result:', result);
  } catch (error) {
    console.error('Error getting developer:', error);
  }
}

// Test deleting a specific image
async function testDeleteImage(developerId, imageIndex) {
  console.log(`Testing delete image ${imageIndex} from developer ${developerId}...`);

  try {
    const response = await fetch(`${BASE_URL}/${developerId}/images/${imageIndex}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    console.log('Delete Image Result:', result);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}

// Test updating a developer
async function testUpdateDeveloper(developerId) {
  console.log(`Testing update developer ${developerId}...`);

  const updateData = {
    buildername: 'Updated Test Developer',
    descriptions: 'Updated description with images support',
    project_name: JSON.stringify(['Updated Project 1', 'Updated Project 2']),
    images: JSON.stringify(['http://example.com/image1.jpg', 'http://example.com/image2.jpg'])
  };

  try {
    const response = await fetch(`${BASE_URL}/${developerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    console.log('Update Developer Result:', result);
  } catch (error) {
    console.error('Error updating developer:', error);
  }
}

// Test deleting a developer
async function testDeleteDeveloper(developerId) {
  console.log(`Testing delete developer ${developerId}...`);

  try {
    const response = await fetch(`${BASE_URL}/${developerId}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    console.log('Delete Developer Result:', result);
  } catch (error) {
    console.error('Error deleting developer:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Developer Images API Tests...\n');

  // Test 1: Create a developer
  const developerId = await testCreateDeveloper();
  if (!developerId) {
    console.log('Failed to create developer, stopping tests');
    return;
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Upload images (commented out since we don't have test files)
  // await testUploadImages(developerId);

  // Test 3: Get all developers
  await testGetAllDevelopers();

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Get specific developer
  await testGetDeveloper(developerId);

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Update developer
  await testUpdateDeveloper(developerId);

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 6: Delete specific image (commented out since we don't have images)
  // await testDeleteImage(developerId, 0);

  // Test 7: Delete developer
  await testDeleteDeveloper(developerId);

  console.log('\nTests completed!');
}

// Run the tests
runTests().catch(console.error);
