const sequelize = require('./database');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');

const syncDatabase = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Create tables if they don't exist
        await User.sync({ force: true });
        console.log('User table created successfully');

        await Blog.sync({ force: true });
        console.log('Blog table created successfully');

        // Verify table creation
        const [tables] = await sequelize.query("SHOW TABLES");
        console.log('Current tables in database:', tables);

        // Create test data
        const user = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Test user created successfully');

        const blog = await Blog.create({
            blogTitle: 'Test Blog',
            blogDescription: 'This is a test blog',
            blogContent: 'This is the content of the test blog',
            writer: 'Test User',
            category: 'Technology',
            tags: ['test', 'blog'],
            slug: 'test-blog',
            dynamicFields: {
                readingTime: 5,
                isFeatured: true
            },
            fieldSchema: {
                readingTime: { type: 'number', label: 'Reading Time (minutes)' },
                isFeatured: { type: 'boolean', label: 'Featured Post' }
            }
        });
        console.log('Test blog created successfully');

    } catch (error) {
        console.error('Error during database initialization:', error);
    }
};

module.exports = syncDatabase; 