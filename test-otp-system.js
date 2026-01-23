// Using built-in fetch (Node.js 18+)

const BASE_URL = 'https://api.realtraspaces.com/api/webusers';

async function testOtpSystem() {
    console.log('🧪 Testing OTP Authentication System...\n');

    try {
        // Test 1: Send Registration OTP
        console.log('1️⃣ Testing Send Registration OTP...');
        const registrationOtpResponse = await fetch(`${BASE_URL}/send-registration-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                mobileNumber: '9876543210',
                location: 'Mumbai',
                company: 'Test Company'
            })
        });

        const registrationOtpResult = await registrationOtpResponse.json();
        console.log('Registration OTP Response:', registrationOtpResult);

        if (registrationOtpResult.status === 'success') {
            console.log('✅ Registration OTP sent successfully!');

            // Test 2: Verify Registration OTP (using a dummy OTP for testing)
            console.log('\n2️⃣ Testing Verify Registration OTP...');
            const verifyRegistrationResponse = await fetch(`${BASE_URL}/verify-registration-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'john.doe@example.com',
                    otpCode: '123456', // This would be the actual OTP from email
                    fullName: 'John Doe',
                    mobileNumber: '9876543210',
                    location: 'Mumbai',
                    company: 'Test Company'
                })
            });

            const verifyRegistrationResult = await verifyRegistrationResponse.json();
            console.log('Verify Registration Response:', verifyRegistrationResult);
        }

        // Test 3: Send Login OTP
        console.log('\n3️⃣ Testing Send Login OTP...');
        const loginOtpResponse = await fetch(`${BASE_URL}/send-login-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'john.doe@example.com'
            })
        });

        const loginOtpResult = await loginOtpResponse.json();
        console.log('Login OTP Response:', loginOtpResult);

        if (loginOtpResult.status === 'success') {
            console.log('✅ Login OTP sent successfully!');

            // Test 4: Verify Login OTP
            console.log('\n4️⃣ Testing Verify Login OTP...');
            const verifyLoginResponse = await fetch(`${BASE_URL}/verify-login-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'john.doe@example.com',
                    otpCode: '123456' // This would be the actual OTP from email
                })
            });

            const verifyLoginResult = await verifyLoginResponse.json();
            console.log('Verify Login Response:', verifyLoginResult);
        }

        console.log('\n🎉 OTP System Test Completed!');
        console.log('\n📋 API Endpoints Summary:');
        console.log('• POST /api/webusers/send-registration-otp - Send OTP for registration');
        console.log('• POST /api/webusers/verify-registration-otp - Verify OTP and complete registration');
        console.log('• POST /api/webusers/send-login-otp - Send OTP for login');
        console.log('• POST /api/webusers/verify-login-otp - Verify OTP and complete login');

    } catch (error) {
        console.error('💥 Test failed with error:', error.message);
    }
}

// Run the test
testOtpSystem()
    .then(() => {
        console.log('\n✨ OTP system test completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Test failed with error:', error);
        process.exit(1);
    });
