const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        console.log('--- STARTING LOGIN DEBUG ---');

        const testEmail = `debug_${Date.now()}@test.com`;
        const testPassword = 'Password123!';

        console.log(`Creating user with email: ${testEmail} and password: ${testPassword}`);

        // 1. Create User
        const newUser = await Webuser.create({
            fullName: 'Debug User',
            mobileNumber: '1234567890',
            email: testEmail,
            location: 'Test Loc',
            company: 'Test Co',
            password: testPassword
        });

        console.log(`User created with ID: ${newUser.id}`);
        console.log(`Stored Hash: ${newUser.password}`);

        // 2. Fetch User
        const fetchedUser = await Webuser.scope('withPassword').findOne({
            where: { email: testEmail }
        });

        console.log(`Fetched User ID: ${fetchedUser.id}`);
        console.log(`Fetched Hash: ${fetchedUser.password}`);

        // 3. Test Compare Correct
        const isMatch = fetchedUser.validPassword(testPassword);
        console.log(`Checking match for '${testPassword}': ${isMatch}`);

        // 4. Test Compare Incorrect
        const isMatchWrong = fetchedUser.validPassword('WrongPass');
        console.log(`Checking match for 'WrongPass': ${isMatchWrong}`);

        // 5. Test Manual Bcrypt
        const manualMatch = bcrypt.compareSync(testPassword, fetchedUser.password);
        console.log(`Manual bcrypt check: ${manualMatch}`);

    } catch (e) {
        console.error("ERROR:", e);
    } finally {
        await sequelize.close();
    }
}

run();
