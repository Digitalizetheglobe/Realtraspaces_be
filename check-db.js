const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'realtraspaces_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log,
  }
);

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // List all tables
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:');
    console.log(results);
    
    // Check SequelizeMeta table for migrations
    try {
      const [migrations] = await sequelize.query('SELECT * FROM SequelizeMeta');
      console.log('\nApplied migrations:');
      console.log(migrations);
    } catch (e) {
      console.log('\nSequelizeMeta table does not exist or cannot be accessed');
    }
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();
