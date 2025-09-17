const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/property-listings';
const API_KEY = ''; // Add if you have authentication

// Test data
const testProperties = [
    {
        name: 'Office Space Test',
        data: {
            "propertyName": "Tech Tower Business Center",
            "location": "Sector 18, Gurgaon",
            "propertyType": "Office",
            "transactionType": "Lease",
            "areaCarpet": "3200 sq ft",
            "areaBuiltup": "4000 sq ft",
            "rent": 180000.00,
            "price": null,
            "contactName": "Rahul Mehta",
            "contactNumber": "+91-9988776655",
            "emailAddress": "rahul.mehta@techproperties.com",
            "description": "Premium office space with sea view, fully furnished with modern amenities including high-speed internet, conference rooms, and dedicated parking.",
            "images": [
                "property-test-001-exterior.jpg",
                "property-test-002-lobby.jpg",
                "property-test-003-office-floor.jpg",
                "property-test-004-conference-room.jpg",
                "property-test-005-pantry.jpg"
            ]
        }
    },
    {
        name: 'Retail Space Test',
        data: {
            "propertyName": "Street Side Retail Shop",
            "location": "Khan Market, New Delhi",
            "propertyType": "Retail",
            "transactionType": "Sale",
            "areaCarpet": "600 sq ft",
            "areaBuiltup": "750 sq ft",
            "rent": null,
            "price": 4500000.00,
            "contactName": "Sunita Kapoor",
            "contactNumber": "+91-8877665544",
            "emailAddress": "sunita.kapoor@retailspaces.in",
            "description": "Prime retail location with high foot traffic, perfect for boutique or electronics store.",
            "images": [
                "property-test-006-storefront.jpg",
                "property-test-007-interior.jpg"
            ]
        }
    },
    {
        name: 'Coworking Space Test',
        data: {
            "propertyName": "Creative Workspace Hub",
            "location": "Koramangala, Bangalore",
            "propertyType": "Coworking",
            "transactionType": "BOTH",
            "areaCarpet": "8000 sq ft",
            "areaBuiltup": "10000 sq ft",
            "rent": 350000.00,
            "price": 15000000.00,
            "contactName": "Arjun Reddy",
            "contactNumber": "+91-7766554433",
            "emailAddress": "arjun.reddy@creativespaces.com",
            "description": "State-of-the-art coworking facility with 200+ desks, multiple meeting rooms, event space, rooftop cafe, and wellness area.",
            "images": [
                "property-test-008-main-workspace.jpg",
                "property-test-009-meeting-room-1.jpg",
                "property-test-010-meeting-room-2.jpg",
                "property-test-011-phone-booths.jpg",
                "property-test-012-reception.jpg",
                "property-test-013-cafe-area.jpg"
            ]
        }
    },
    {
        name: 'Warehouse Test',
        data: {
            "propertyName": "Industrial Storage Facility",
            "location": "Manesar Industrial Area, Haryana",
            "propertyType": "Industrial or warehouse",
            "transactionType": "Lease",
            "areaCarpet": "25000 sq ft",
            "areaBuiltup": "30000 sq ft",
            "rent": 750000.00,
            "price": null,
            "contactName": "Manoj Kumar",
            "contactNumber": "+91-6655443322",
            "emailAddress": "manoj.kumar@industrialspaces.co.in",
            "description": "Large warehouse with 40 ft height, multiple loading docks, office space, and 24/7 security.",
            "images": []
        }
    },
    {
        name: 'Land Plot Test',
        data: {
            "propertyName": "Commercial Development Land",
            "location": "NH-8, Gurgaon",
            "propertyType": "Land",
            "transactionType": "Sale",
            "areaCarpet": "50000 sq ft",
            "areaBuiltup": "50000 sq ft",
            "rent": null,
            "price": 125000000.00,
            "contactName": "Deepak Sharma",
            "contactNumber": "+91-5544332211",
            "emailAddress": "deepak.sharma@landdeals.net",
            "description": "Commercial land with highway frontage, ideal for mall, hotel, or commercial complex development.",
            "images": [
                "property-test-018-land-aerial-view.jpg"
            ]
        }
    },
    {
        name: 'Preleased Property Test',
        data: {
            "propertyName": "Corporate Office Complex",
            "location": "Bandra Kurla Complex, Mumbai",
            "propertyType": "Office",
            "transactionType": "Preleased",
            "areaCarpet": "12000 sq ft",
            "areaBuiltup": "15000 sq ft",
            "rent": null,
            "price": 45000000.00,
            "contactName": "Kavita Joshi",
            "contactNumber": "+91-9876543210",
            "emailAddress": "kavita.joshi@premiumproperties.com",
            "description": "Preleased to Fortune 500 company with 15-year lease agreement, 8% assured returns with annual escalation.",
            "images": [
                "property-test-019-building-exterior.jpg",
                "property-test-020-lobby-entrance.jpg",
                "property-test-021-elevator-area.jpg",
                "property-test-022-office-view.jpg"
            ]
        }
    }
];

// Helper function to make API calls
async function apiCall(method, endpoint, data = null) {
    try {
        const config = {
            method: method,
            url: `${BASE_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            config.data = data;
        }

        if (API_KEY) {
            config.headers['Authorization'] = `Bearer ${API_KEY}`;
        }

        const response = await axios(config);
        return {
            success: true,
            status: response.status,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            status: error.response?.status || 0,
            data: error.response?.data || { error: error.message }
        };
    }
}

// Test functions
async function testCreateProperty() {
    console.log('\n🚀 Testing CREATE Property Listings...');
    const createdIds = [];

    for (const testProperty of testProperties) {
        console.log(`\nCreating: ${testProperty.name}`);
        const result = await apiCall('POST', '/create', testProperty.data);
        
        if (result.success) {
            console.log('✅ Success:', result.data.message);
            createdIds.push(result.data.data.id);
            console.log('   ID:', result.data.data.id);
        } else {
            console.log('❌ Failed:', result.data.message || result.data.error);
        }
    }

    return createdIds;
}

async function testGetAllProperties() {
    console.log('\n📋 Testing GET ALL Properties...');
    
    // Test without filters
    console.log('\nGetting all properties:');
    let result = await apiCall('GET', '/all');
    if (result.success) {
        console.log('✅ Success:', `Found ${result.data.data.listings.length} properties`);
        console.log('   Total items:', result.data.data.pagination.totalItems);
    } else {
        console.log('❌ Failed:', result.data.message || result.data.error);
    }

    // Test with filters
    console.log('\nGetting properties with filters (Office, approved):');
    result = await apiCall('GET', '/all?propertyType=Office&status=approved&page=1&limit=5');
    if (result.success) {
        console.log('✅ Success:', `Found ${result.data.data.listings.length} filtered properties`);
    } else {
        console.log('❌ Failed:', result.data.message || result.data.error);
    }

    // Test search
    console.log('\nSearching properties (search=gurgaon):');
    result = await apiCall('GET', '/all?search=gurgaon');
    if (result.success) {
        console.log('✅ Success:', `Found ${result.data.data.listings.length} search results`);
    } else {
        console.log('❌ Failed:', result.data.message || result.data.error);
    }
}

async function testGetPropertyById(propertyIds) {
    console.log('\n🔍 Testing GET Property by ID...');
    
    if (propertyIds.length === 0) {
        console.log('⚠️  No property IDs available for testing');
        return;
    }

    const testId = propertyIds[0];
    console.log(`\nGetting property with ID: ${testId}`);
    const result = await apiCall('GET', `/${testId}`);
    
    if (result.success) {
        console.log('✅ Success:', result.data.message);
        console.log('   Property:', result.data.data.propertyName);
        console.log('   Images count:', result.data.data.images?.length || 0);
    } else {
        console.log('❌ Failed:', result.data.message || result.data.error);
    }

    // Test with invalid ID
    console.log('\nTesting with invalid ID (999999):');
    const invalidResult = await apiCall('GET', '/999999');
    if (!invalidResult.success && invalidResult.status === 404) {
        console.log('✅ Correctly handled invalid ID');
    } else {
        console.log('❌ Unexpected response for invalid ID');
    }
}

async function testUpdateProperty(propertyIds) {
    console.log('\n✏️  Testing UPDATE Property...');
    
    if (propertyIds.length === 0) {
        console.log('⚠️  No property IDs available for testing');
        return;
    }

    const testId = propertyIds[0];
    const updateData = {
        "rent": 220000.00,
        "description": "UPDATED: Premium office space with additional amenities, renovated interiors, and expanded parking facility.",
        "images": [
            "property-updated-001-new-exterior.jpg",
            "property-updated-002-renovated-lobby.jpg",
            "property-updated-003-modern-office-space.jpg"
        ]
    };

    console.log(`\nUpdating property with ID: ${testId}`);
    const result = await apiCall('PUT', `/${testId}`, updateData);
    
    if (result.success) {
        console.log('✅ Success:', result.data.message);
        console.log('   Updated rent:', result.data.data.rent);
        console.log('   Updated images count:', result.data.data.images?.length || 0);
    } else {
        console.log('❌ Failed:', result.data.message || result.data.error);
    }
}

async function testUpdateStatus(propertyIds) {
    console.log('\n🔄 Testing UPDATE Status...');
    
    if (propertyIds.length < 2) {
        console.log('⚠️  Need at least 2 property IDs for status testing');
        return;
    }

    const statuses = ['approved', 'active', 'rejected'];
    
    for (let i = 0; i < Math.min(statuses.length, propertyIds.length); i++) {
        const testId = propertyIds[i];
        const status = statuses[i];
        
        console.log(`\nUpdating property ${testId} status to: ${status}`);
        const result = await apiCall('PATCH', `/${testId}/status`, { status });
        
        if (result.success) {
            console.log('✅ Success:', result.data.message);
        } else {
            console.log('❌ Failed:', result.data.message || result.data.error);
        }
    }
}

async function testGetByStatus() {
    console.log('\n📊 Testing GET by Status...');
    
    const statuses = ['pending', 'approved', 'active'];
    
    for (const status of statuses) {
        console.log(`\nGetting properties with status: ${status}`);
        const result = await apiCall('GET', `/status/${status}`);
        
        if (result.success) {
            console.log('✅ Success:', `Found ${result.data.data.listings.length} properties with status '${status}'`);
        } else {
            console.log('❌ Failed:', result.data.message || result.data.error);
        }
    }
}

async function testDeleteProperty(propertyIds) {
    console.log('\n🗑️  Testing DELETE Property...');
    
    if (propertyIds.length === 0) {
        console.log('⚠️  No property IDs available for testing');
        return;
    }

    // Only delete the last created property
    const testId = propertyIds[propertyIds.length - 1];
    
    console.log(`\nDeleting property with ID: ${testId}`);
    const result = await apiCall('DELETE', `/${testId}`);
    
    if (result.success) {
        console.log('✅ Success:', result.data.message);
    } else {
        console.log('❌ Failed:', result.data.message || result.data.error);
    }

    // Test deleting already deleted property
    console.log(`\nTrying to delete already deleted property: ${testId}`);
    const deleteAgainResult = await apiCall('DELETE', `/${testId}`);
    if (!deleteAgainResult.success && deleteAgainResult.status === 404) {
        console.log('✅ Correctly handled already deleted property');
    } else {
        console.log('❌ Unexpected response for already deleted property');
    }
}

async function testValidationErrors() {
    console.log('\n⚠️  Testing Validation Errors...');
    
    // Test missing required fields
    console.log('\nTesting missing required fields:');
    const incompleteData = {
        "propertyName": "Test Property",
        "location": "Test Location"
        // Missing required fields: propertyType, transactionType, etc.
    };
    
    const result1 = await apiCall('POST', '/create', incompleteData);
    if (!result1.success && result1.status === 400) {
        console.log('✅ Correctly handled missing required fields');
        console.log('   Error:', result1.data.message);
    } else {
        console.log('❌ Did not properly validate required fields');
    }

    // Test invalid email
    console.log('\nTesting invalid email format:');
    const invalidEmailData = {
        "propertyType": "Office",
        "transactionType": "Lease",
        "areaCarpet": "1000 sq ft",
        "areaBuiltup": "1200 sq ft",
        "rent": 50000,
        "contactName": "Test User",
        "contactNumber": "+91-1234567890",
        "emailAddress": "invalid-email-format"
    };
    
    const result2 = await apiCall('POST', '/create', invalidEmailData);
    if (!result2.success && result2.status === 400) {
        console.log('✅ Correctly handled invalid email format');
        console.log('   Error:', result2.data.message);
    } else {
        console.log('❌ Did not properly validate email format');
    }

    // Test invalid transaction type validation
    console.log('\nTesting Lease without rent:');
    const noRentData = {
        "propertyType": "Office",
        "transactionType": "Lease",
        "areaCarpet": "1000 sq ft",
        "areaBuiltup": "1200 sq ft",
        // Missing rent for Lease type
        "contactName": "Test User",
        "contactNumber": "+91-1234567890",
        "emailAddress": "test@example.com"
    };
    
    const result3 = await apiCall('POST', '/create', noRentData);
    if (!result3.success && result3.status === 400) {
        console.log('✅ Correctly handled missing rent for Lease');
        console.log('   Error:', result3.data.message);
    } else {
        console.log('❌ Did not properly validate rent requirement for Lease');
    }
}

// Main test runner
async function runAllTests() {
    console.log('🧪 Starting Property Listing API Tests...');
    console.log('📡 Base URL:', BASE_URL);
    
    try {
        // Create test properties
        const createdIds = await testCreateProperty();
        
        // Test all GET operations
        await testGetAllProperties();
        await testGetPropertyById(createdIds);
        
        // Test updates
        await testUpdateProperty(createdIds);
        await testUpdateStatus(createdIds);
        
        // Test status filtering
        await testGetByStatus();
        
        // Test validation errors
        await testValidationErrors();
        
        // Test delete (only delete one property)
        await testDeleteProperty(createdIds);
        
        console.log('\n✨ All tests completed!');
        console.log(`📊 Created ${createdIds.length} test properties (${createdIds.length - 1} remain for manual testing)`);
        
    } catch (error) {
        console.error('\n💥 Test execution failed:', error.message);
    }
}

// Export functions for individual testing
module.exports = {
    testCreateProperty,
    testGetAllProperties,
    testGetPropertyById,
    testUpdateProperty,
    testUpdateStatus,
    testGetByStatus,
    testDeleteProperty,
    testValidationErrors,
    runAllTests,
    apiCall,
    BASE_URL,
    testProperties
};

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}
