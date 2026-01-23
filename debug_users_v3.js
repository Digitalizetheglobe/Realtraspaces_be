const Webuser = require('./src/models/webuser.model');
const sequelize = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function run() {
    try {
        await new Promise(r => setTimeout(r, 1000));

        const users = await Webuser.scope('withPassword').findAll({
            limit: 3,
            order: [['created_at', 'DESC']],
            raw: true
        });

        const results = users.map(u => ({
            id: u.id,
            email: u.email,
            created: u.created_at,
            isActive: u.isActive,
            isPlaceholder: bcrypt.compareSync('otp_authenticated', u.password)
        }));

        console.log('JSON_OUTPUT_START');
        console.log(JSON.stringify(results));
        console.log('JSON_OUTPUT_END');

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

run();
