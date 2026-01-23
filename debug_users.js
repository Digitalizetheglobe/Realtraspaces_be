const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        // Wait briefly for connection (invoked by require)
        await new Promise(r => setTimeout(r, 1000));

        console.log('\nRunning User Debugger...\n');

        const users = await Webuser.scope('withPassword').findAll({
            limit: 5,
            order: [['created_at', 'DESC']]
        });

        console.log('Found', users.length, 'recent users.');

        for (const u of users) {
            console.log('--------------------------------------------------');
            console.log('ID:', u.id);
            console.log('Email:', u.email);
            console.log('Created At:', u.created_at);
            console.log('Password Hash (first 20 chars):', u.password ? u.password.substring(0, 20) + '...' : 'NULL');

            if (u.password) {
                const isPlaceholder = bcrypt.compareSync('otp_authenticated', u.password);
                console.log('Is Password "otp_authenticated" (from before fix)?', isPlaceholder);
            }
        }
        console.log('--------------------------------------------------');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

run();
