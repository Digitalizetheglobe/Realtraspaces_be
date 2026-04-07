const Otp = require('./src/models/otp.model');
const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const testEmail = `signup_flow_${Date.now()}@test.com`;
        const testPassword = 'Password123!';
        const testMobile = `${Math.floor(Math.random() * 10000000000)}`;

        console.log(`Starting Signup Flow Debug for: ${testEmail}`);

        // 1. Send Registration OTP
        console.log("1. Sending OTP...");
        const sendOtpResponse = await fetch('http://localhost:8000/api/webusers/send-registration-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Signup Debug User',
                email: testEmail,
                mobileNumber: testMobile,
                location: 'Test Loc',
                company: 'Test Co'
            })
        });

        if (!sendOtpResponse.ok) {
            const err = await sendOtpResponse.text();
            throw new Error(`Send OTP failed: ${err}`);
        }
        console.log("OTP Sent.");

        // 2. Find OTP in DB
        // Wait a bit for DB to update?
        await new Promise(r => setTimeout(r, 1000));

        const otpRecord = await Otp.findOne({
            where: { email: testEmail, otpType: 'registration' },
            order: [['created_at', 'DESC']]
        });

        if (!otpRecord) {
            throw new Error("Could not find OTP record in DB");
        }

        const otpCode = otpRecord.otpCode;
        console.log(`2. Found OTP in DB: ${otpCode}`);

        // 3. Verify OTP & Register
        console.log("3. Verifying OTP and Registering...");
        const verifyResponse = await fetch('http://localhost:8000/api/webusers/verify-registration-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                otpCode: otpCode,
                fullName: 'Signup Debug User',
                mobileNumber: testMobile,
                location: 'Test Loc',
                company: 'Test Co',
                password: testPassword
            })
        });

        const verifyResult = await verifyResponse.json();

        if (!verifyResponse.ok) {
            console.log("Verify Result:", JSON.stringify(verifyResult, null, 2));
            throw new Error(`Verify OTP failed: ${verifyResult.message}`);
        }
        console.log("Registration Successful.");

        // 4. Verify Password stored in DB (Direct Check)
        const user = await Webuser.scope('withPassword').findOne({ where: { email: testEmail } });
        console.log(`Stored Hash: ${user.password}`);
        const isMatch = user.validPassword(testPassword);
        console.log(`Direct Model Check (validPassword): ${isMatch}`);

        // 5. Try Login API
        console.log("5. Attempting Login API...");
        const loginResponse = await fetch('http://localhost:8000/api/webusers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });

        const loginResult = await loginResponse.json();
        console.log(`Login API Status: ${loginResponse.status}`);
        console.log(`Login API Result: ${JSON.stringify(loginResult, null, 2)}`);

        if (loginResponse.ok) {
            console.log("SUCCESS: Signup -> Login flow works perfectly.");
        } else {
            console.log("FAILURE: Login failed after signup.");
        }

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await sequelize.close();
    }
}

run();
