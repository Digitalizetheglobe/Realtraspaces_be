const sequelize = require('./database');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');
const Job = require('../models/job.model');
const JobApplication = require('../models/jobApplication.model');
const Testimonial = require('../models/testimonial.model');
const Team = require('../models/team.model');
const PropertyListing = require('../models/propertyListing.model');
const CookiePolicy = require('../models/cookiePolicy.model');
const Developer = require('../models/developer.model');
const Webuser = require('../models/webuser.model');
const SavedProperty = require('../models/savedProperty.model');
const PropertyComparison = require('../models/propertyComparison.model');

const syncDatabase = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // In production, avoid `alter: true` as it can cause heavy ALTER TABLE operations
        // and issues like "Too many keys specified; max 64 keys allowed" on large tables.
        //
        // Use simple sync to ensure models are initialized without altering existing schema.
        await sequelize.sync();
        console.log('All models were synchronized successfully (without alter).');

        User.hasMany(CookiePolicy, { foreignKey: 'userId', as: 'cookiePolicies' });
        CookiePolicy.belongsTo(User, { foreignKey: 'userId', as: 'user' });
        
        Webuser.hasMany(SavedProperty, { foreignKey: 'webUserId', as: 'savedProperties' });
        SavedProperty.belongsTo(Webuser, { foreignKey: 'webUserId', as: 'user' });
        
        Webuser.hasMany(PropertyComparison, { foreignKey: 'webUserId', as: 'propertyComparisons' });
        PropertyComparison.belongsTo(Webuser, { foreignKey: 'webUserId', as: 'user' });
        
        // IMPORTANT: Only uncomment and use force: true when you need to recreate tables
        // and are okay with losing all data
        // await sequelize.sync({ force: true });

        // Create test data
        // const user = await User.create({
        //     username: 'testuser',
        //     email: 'test@example.com',
        //     password: 'password123'
        // });
        // console.log('Test user created successfully');

        // const blog = await Blog.create({
        //     blogTitle: 'Test Blog',
        //     blogDescription: 'This is a test blog',
        //     blogContent: 'This is the content of the test blog',
        //     writer: 'Test Writer',
        //     category: 'Test Category',
        //     tags: ['test', 'blog'],
        //     slug: 'test-blog',
        //     dynamicFields: {
        //         readingTime: 5,
        //         isFeatured: true
        //     }
        // });
        // console.log('Test blog created successfully');

        // const job = await Job.create({
        //     jobTitle: 'Software Engineer',
        //     jobId: 'SE-001',
        //     location: 'Remote',
        //     jobType: 'Full-time',
        //     experienceLevel: 'Mid-level',
        //     salaryRange: '$80,000 - $100,000',
        //     postedDate: new Date(),
        //     applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        //     jobDescription: 'We are looking for a skilled Software Engineer...',
        //     requirements: '5+ years of experience...',
        //     benefits: 'Health insurance, 401k...',
        //     isActive: true
        // });
        // console.log('Test job created successfully');

        // const application = await JobApplication.create({
        //     jobId: 'SE-001',
        //     firstName: 'John',
        //     lastName: 'Doe',
        //     email: 'john.doe@example.com',
        //     phone: '1234567890',
        //     currentCompany: 'Tech Corp',
        //     linkedInProfileLink: 'https://linkedin.com/in/johndoe',
        //     experienceYears: 5,
        //     status: 'under_review'
        // });
        // console.log('Test application created successfully');

        // const testTestimonial = await Testimonial.create({
        //     name: 'John Doe',
        //     testimonial: 'Great service!',
        //     rating: 5,
        //     isActive: true
        // });
        // console.log('Test testimonial created:', testTestimonial.toJSON());

    } catch (error) {
        console.error('Error during database initialization:', error);
    }
};

module.exports = syncDatabase; 