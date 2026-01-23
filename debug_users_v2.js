const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        await new Promise(r => setTimeout(r, 1000));
        console.log('DEBUG_START');

        const users = await Webuser.scope('withPassword').findAll({
            limit: 3,
            order: [['created_at', 'DESC']]
        });

        console.log(`Found ${users.length} users.`);

        for (const u of users) {
            console.log(`[User ${u.id}]`);
            console.log(`  Email: ${u.email}`);
            console.log(`  CreatedAt: ${u.created_at}`);
            console.log(`  IsActive: ${u.isActive}`);
            console.log(`  PasswordHash: ${u.password ? u.password.substring(0, 10) + '...' : 'NULL'}`);

            if (u.password) {
                const isPlaceholder = bcrypt.compareSync('otp_authenticated', u.password);
                console.log(`  IsPlaceholder: ${isPlaceholder}`);
            }
        }
        console.log('DEBUG_END');

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

run();
