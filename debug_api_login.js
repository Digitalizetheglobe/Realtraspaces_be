const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');

async function run() {
    try {
        const testEmail = `api_debug_${Date.now()}@test.com`;
        const testPassword = 'Password123!';

        console.log(`Creating user locally: ${testEmail}`);

        // 1. Create User
        await Webuser.create({
            fullName: 'API Debug User',
            mobileNumber: `${Math.floor(Math.random() * 10000000000)}`,
            email: testEmail,
            location: 'Test Loc',
            company: 'Test Co',
            password: testPassword
        });

        console.log("User created in DB. Attempting login via API...");

        // 2. Login via API
        const response = await fetch('https://api.realtraspaces.com/api/webusers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword
            })
        });

        const data = await response.json();
        console.log("API Response Status:", response.status);
        console.log("API Response Body:", JSON.stringify(data, null, 2));

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await sequelize.close();
    }
}

run();
