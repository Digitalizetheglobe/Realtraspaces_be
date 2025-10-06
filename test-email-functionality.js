const emailService = require('./src/services/emailService');

async function testEmailFunctionality() {
    console.log('🧪 Testing Email Functionality...\n');

    // Test data - simulating a new user registration
    const testUserData = {
        fullName: 'John Doe',
        email: 'test@realtraspaces.com', // Change this to your test email
        location: 'Mumbai',
        company: 'Test Company',
        mobileNumber: '9876543210'
    };

    console.log('📧 Test User Data:');
    console.log(JSON.stringify(testUserData, null, 2));
    console.log('\n');

    try {
        // Test 1: Send welcome email to user
        console.log('1️⃣ Testing Welcome Email...');
        const welcomeResult = await emailService.sendWelcomeEmail({
            fullName: testUserData.fullName,
            email: testUserData.email,
            location: testUserData.location,
            company: testUserData.company
        });

        if (welcomeResult.success) {
            console.log('✅ Welcome email sent successfully!');
            console.log(`📧 Message ID: ${welcomeResult.messageId}`);
        } else {
            console.log('❌ Welcome email failed:', welcomeResult.error);
        }

        console.log('\n');

        // Test 2: Send admin notification email
        console.log('2️⃣ Testing Admin Notification Email...');
        const adminResult = await emailService.sendAdminNotificationEmail(testUserData);

        if (adminResult.success) {
            console.log('✅ Admin notification email sent successfully!');
            console.log(`📧 Message ID: ${adminResult.messageId}`);
        } else {
            console.log('❌ Admin notification email failed:', adminResult.error);
        }

        console.log('\n');

        // Summary
        console.log('📊 Test Summary:');
        console.log(`Welcome Email: ${welcomeResult.success ? '✅ Success' : '❌ Failed'}`);
        console.log(`Admin Email: ${adminResult.success ? '✅ Success' : '❌ Failed'}`);

        if (welcomeResult.success && adminResult.success) {
            console.log('\n🎉 All email tests passed! Email functionality is working correctly.');
        } else {
            console.log('\n⚠️ Some email tests failed. Check the configuration and credentials.');
        }

    } catch (error) {
        console.error('💥 Test execution error:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Run the test
testEmailFunctionality()
    .then(() => {
        console.log('\n✨ Email functionality test completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Test failed with error:', error);
        process.exit(1);
    });
