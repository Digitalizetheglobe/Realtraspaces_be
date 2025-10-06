const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test property creation with image upload
async function testPropertyCreationWithImages() {
  const API_BASE_URL = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing Property Creation with Image Upload...\n');
    
    // Create FormData
    const formData = new FormData();
    
    // Add property data
    formData.append('propertyName', 'Test Property with Images');
    formData.append('location', 'Test Location');
    formData.append('propertyType', 'Office');
    formData.append('transactionType', 'Lease');
    formData.append('areaCarpet', '1000');
    formData.append('areaBuiltup', '1200');
    formData.append('rent', '50000');
    formData.append('contactName', 'Test Contact');
    formData.append('contactNumber', '+919876543210');
    formData.append('emailAddress', 'test@example.com');
    formData.append('description', 'This is a test property listing with images');
    
    // Create a test image file (simple 1x1 pixel PNG)
    const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    
    // Write test image to temporary file
    const testImagePath = path.join(__dirname, 'test-image.png');
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    // Add test images to FormData
    formData.append('images', fs.createReadStream(testImagePath), {
      filename: 'test-image-1.png',
      contentType: 'image/png'
    });
    
    // Add another test image
    formData.append('images', fs.createReadStream(testImagePath), {
      filename: 'test-image-2.png',
      contentType: 'image/png'
    });
    
    console.log('📤 Sending request to create property with images...');
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}/api/property-listings/create`, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(result, null, 2));
    
    if (result.success && result.data.images && result.data.images.length > 0) {
      console.log('✅ SUCCESS: Property created with images!');
      console.log('📷 Images uploaded:', result.data.images);
      
      // Test image access
      console.log('\n🔍 Testing image access...');
      for (const imageFilename of result.data.images) {
        const imageUrl = `${API_BASE_URL}/propertyImages/${imageFilename}`;
        console.log(`🖼️  Image URL: ${imageUrl}`);
        
        try {
          const imageResponse = await fetch(imageUrl);
          if (imageResponse.ok) {
            console.log(`✅ Image accessible: ${imageFilename}`);
          } else {
            console.log(`❌ Image not accessible: ${imageFilename} (Status: ${imageResponse.status})`);
          }
        } catch (error) {
          console.log(`❌ Error accessing image: ${imageFilename}`, error.message);
        }
      }
      
    } else {
      console.log('❌ FAILED: Property created but no images uploaded');
      console.log('Images in response:', result.data?.images);
    }
    
    // Clean up test image
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('🧹 Cleaned up test image file');
    }
    
  } catch (error) {
    console.error('❌ Error testing property creation:', error);
  }
}

// Test property listing retrieval
async function testPropertyListingsRetrieval() {
  const API_BASE_URL = 'http://localhost:3000';
  
  try {
    console.log('\n🧪 Testing Property Listings Retrieval...\n');
    
    const response = await fetch(`${API_BASE_URL}/api/property-listings/all`);
    const result = await response.json();
    
    console.log('📥 Response Status:', response.status);
    console.log('📥 Total Properties:', result.data?.listings?.length || 0);
    
    if (result.success && result.data.listings) {
      result.data.listings.forEach((property, index) => {
        console.log(`\n🏠 Property ${index + 1}:`);
        console.log(`   ID: ${property.id}`);
        console.log(`   Name: ${property.propertyName}`);
        console.log(`   Images: ${property.images?.length || 0} images`);
        if (property.images && property.images.length > 0) {
          property.images.forEach((image, imgIndex) => {
            console.log(`     Image ${imgIndex + 1}: ${image}`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing property listings retrieval:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Property Listing Image Upload Tests\n');
  console.log('=' * 60);
  
  await testPropertyCreationWithImages();
  await testPropertyListingsRetrieval();
  
  console.log('\n' + '=' * 60);
  console.log('🏁 Tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or a fetch polyfill');
  console.log('💡 Install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests();
