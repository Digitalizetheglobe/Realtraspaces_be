const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        await new Promise(r => setTimeout(r, 1000));
        console.log('--- LATEST USER INSPECTION ---');

        const user = await Webuser.scope('withPassword').findOne({
            order: [['created_at', 'DESC']]
        });

        if (!user) {
            console.log("No users found.");
        } else {
            console.log(`User ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Created: ${user.created_at}`);
            console.log(`Password Hash: ${user.password}`);
            console.log(`Password Hash Length: ${user.password ? user.password.length : 0}`);

            const isPlaceholder = bcrypt.compareSync('otp_authenticated', user.password);
            console.log(`Is Placeholder? ${isPlaceholder}`);
        }
        console.log('--- END INSPECTION ---');

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

run();
