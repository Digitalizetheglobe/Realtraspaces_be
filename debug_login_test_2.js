const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const testEmail = `debug_${Date.now()}@test.com`;
        const testPassword = 'Password123!';

        // 1. Create User
        await Webuser.create({
            fullName: 'Debug User',
            mobileNumber: `${Math.floor(Math.random() * 10000000000)}`,
            email: testEmail,
            location: 'Test Loc',
            company: 'Test Co',
            password: testPassword
        });

        fs.writeFileSync(path.join(__dirname, '..', 'debug_result.txt'), "SUCCESS: User created and password hashed.");

        const fetchedUser = await Webuser.scope('withPassword').findOne({
            where: { email: testEmail }
        });

        if (fetchedUser.validPassword(testPassword)) {
            fs.appendFileSync(path.join(__dirname, '..', 'debug_result.txt'), "\nSUCCESS: Password matches.");
        } else {
            fs.appendFileSync(path.join(__dirname, '..', 'debug_result.txt'), "\nFAILURE: Password does NOT match.");
        }

    } catch (e) {
        fs.writeFileSync(path.join(__dirname, '..', 'debug_result.txt'), `ERROR: ${e.message}\n${JSON.stringify(e, null, 2)}`);
    } finally {
        await sequelize.close();
    }
}

run();
