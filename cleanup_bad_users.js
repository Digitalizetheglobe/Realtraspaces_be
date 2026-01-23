const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        await new Promise(r => setTimeout(r, 1000));
        console.log('CLEANUP_START');

        const users = await Webuser.scope('withPassword').findAll();
        let deletedCount = 0;

        for (const u of users) {
            const isPlaceholder = bcrypt.compareSync('otp_authenticated', u.password);
            if (isPlaceholder) {
                console.log(`Deleting user ${u.id} (${u.email}) with placeholder password...`);
                await u.destroy();
                deletedCount++;
            }
        }

        console.log(`Deleted ${deletedCount} bad users.`);
        console.log('CLEANUP_END');

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

run();
