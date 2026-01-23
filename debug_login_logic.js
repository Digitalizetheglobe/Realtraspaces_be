const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    console.log('--- START DEBUG LOGIN ---');
    try {
        await new Promise(r => setTimeout(r, 1000));

        const testEmail = 'debug_user_' + Date.now() + '@example.com';
        const testPassword = 'Password123!';

        console.log(`1. Creating user ${testEmail} with password ${testPassword}`);

        const user = await Webuser.create({
            fullName: 'Debug User',
            mobileNumber: '1234567890',
            email: testEmail,
            location: 'Test City',
            company: 'Test Co',
            password: testPassword
        });

        console.log(`User created. ID: ${user.id}`);

        // --- FETCH AND CHECK ---
        console.log('2. Fetching user with withPassword scope...');
        const fetchedUser = await Webuser.scope('withPassword').findOne({
            where: { email: testEmail }
        });

        console.log('Fetched Password Hash:', fetchedUser.password);
        console.log('Password length:', fetchedUser.password.length);

        // --- MANUAL COMPARE ---
        console.log('3. Manually comparing password...');
        const manualMatch = bcrypt.compareSync(testPassword, fetchedUser.password);
        console.log(`Manual bcrypt compare: ${manualMatch}`);

        // --- METHOD COMPARE ---
        console.log('4. Testing validPassword method...');
        const methodMatch = fetchedUser.validPassword(testPassword);
        console.log(`validPassword() result: ${methodMatch}`);

        if (manualMatch && methodMatch) {
            console.log('SUCCESS: Hash and Compare logic is working.');
        } else {
            console.log('ERROR: Password hashing logic is broken.');
        }

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

run();
