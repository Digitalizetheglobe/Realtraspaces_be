const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:8000/api/blogs';

// Test data for updating a blog
const testBlogData = {
    blogTitle: 'Updated Test Blog Title',
    blogDescription: 'This is an updated test blog description',
    blogContent: 'This is the updated content of the test blog. It contains more detailed information.',
    writer: 'Updated Test Writer',
    category: 'Updated Test Category',
    tags: JSON.stringify(['updated', 'test', 'blog'])
};

async function testEditBlogAPI() {
    console.log('🧪 Testing Edit Blog API...\n');

    try {
        // First, let's get all blogs to find an existing one
        console.log('1. Getting all blogs...');
        const getAllResponse = await fetch(`${API_BASE_URL}`);
        const allBlogs = await getAllResponse.json();
        
        if (!allBlogs.data || allBlogs.data.length === 0) {
            console.log('❌ No blogs found. Please create a blog first.');
            return;
        }

        const firstBlog = allBlogs.data[0];
        const blogId = firstBlog.id;
        console.log(`✅ Found blog with ID: ${blogId}`);
        console.log(`   Title: ${firstBlog.blogTitle}\n`);

        // Test 1: Update blog without images
        console.log('2. Testing blog update without images...');
        const formData = new FormData();
        
        Object.keys(testBlogData).forEach(key => {
            formData.append(key, testBlogData[key]);
        });

        const updateResponse = await fetch(`${API_BASE_URL}/${blogId}`, {
            method: 'PUT',
            body: formData
        });

        const updateResult = await updateResponse.json();
        
        if (updateResponse.ok) {
            console.log('✅ Blog updated successfully!');
            console.log(`   New title: ${updateResult.data.blogTitle}`);
            console.log(`   New writer: ${updateResult.data.writer}`);
        } else {
            console.log('❌ Failed to update blog:', updateResult.message);
        }

        // Test 2: Get the updated blog to verify changes
        console.log('\n3. Verifying updated blog...');
        const getResponse = await fetch(`${API_BASE_URL}/${blogId}`);
        const getResult = await getResponse.json();
        
        if (getResponse.ok) {
            console.log('✅ Blog retrieved successfully!');
            console.log(`   Title: ${getResult.data.blogTitle}`);
            console.log(`   Writer: ${getResult.data.writer}`);
            console.log(`   Category: ${getResult.data.category}`);
            console.log(`   Tags: ${getResult.data.tags ? getResult.data.tags.join(', ') : 'None'}`);
        } else {
            console.log('❌ Failed to retrieve blog:', getResult.message);
        }

        // Test 3: Update with partial data (only title)
        console.log('\n4. Testing partial update (only title)...');
        const partialFormData = new FormData();
        partialFormData.append('blogTitle', 'Partially Updated Title');

        const partialUpdateResponse = await fetch(`${API_BASE_URL}/${blogId}`, {
            method: 'PUT',
            body: partialFormData
        });

        const partialUpdateResult = await partialUpdateResponse.json();
        
        if (partialUpdateResponse.ok) {
            console.log('✅ Partial update successful!');
            console.log(`   New title: ${partialUpdateResult.data.blogTitle}`);
            console.log(`   Writer (should remain): ${partialUpdateResult.data.writer}`);
        } else {
            console.log('❌ Failed to partially update blog:', partialUpdateResult.message);
        }

        console.log('\n🎉 All tests completed!');

    } catch (error) {
        console.error('❌ Error during testing:', error.message);
    }
}

// Test with image upload (if you have test images)
async function testEditBlogWithImages() {
    console.log('\n🖼️  Testing Edit Blog API with images...\n');

    try {
        // Get a blog to update
        const getAllResponse = await fetch(`${API_BASE_URL}`);
        const allBlogs = await getAllResponse.json();
        
        if (!allBlogs.data || allBlogs.data.length === 0) {
            console.log('❌ No blogs found. Please create a blog first.');
            return;
        }

        const firstBlog = allBlogs.data[0];
        const blogId = firstBlog.id;

        // Create a test image file (simple text file for testing)
        const testImagePath = path.join(__dirname, 'test-image.txt');
        fs.writeFileSync(testImagePath, 'This is a test image file');

        const formData = new FormData();
        formData.append('blogTitle', 'Blog with Images');
        formData.append('blogDescription', 'This blog has been updated with images');
        formData.append('blogContent', 'Content with images');
        formData.append('writer', 'Image Test Writer');
        formData.append('category', 'Image Test Category');
        formData.append('images', fs.createReadStream(testImagePath));

        const updateResponse = await fetch(`${API_BASE_URL}/${blogId}`, {
            method: 'PUT',
            body: formData
        });

        const updateResult = await updateResponse.json();
        
        if (updateResponse.ok) {
            console.log('✅ Blog updated with images successfully!');
            console.log(`   Images: ${updateResult.data.blogImages ? updateResult.data.blogImages.join(', ') : 'None'}`);
        } else {
            console.log('❌ Failed to update blog with images:', updateResult.message);
        }

        // Clean up test file
        fs.unlinkSync(testImagePath);

    } catch (error) {
        console.error('❌ Error during image testing:', error.message);
    }
}

// Run tests
async function runTests() {
    await testEditBlogAPI();
    await testEditBlogWithImages();
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ Fetch is not available. Please use Node.js 18+ or install node-fetch');
    console.log('   npm install node-fetch');
    process.exit(1);
}

runTests();
