const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const syncDatabase = require('./config/db.init');
const userRoutes = require('./routes/user.routes');
const blogRoutes = require('./routes/blog.routes');
const jobRoutes = require('./routes/job.routes');
const jobApplicationRoutes = require('./routes/jobApplication.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const authRoutes = require('./routes/auth.routes');
const webuserRoutes = require('./routes/webuser.routes');
const adminRoutes = require('./routes/adminRoutes');
const seoRoutes = require('./routes/seo.routes');
const teamRoutes = require('./routes/team.routes');
const developerRoutes = require('./routes/developer.routes');
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
const publicPath = path.join(__dirname, '../../public');
console.log('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Serve team images from both /team and /uploads/team paths
app.use('/team', express.static(path.join(publicPath, 'team')));
app.use('/uploads/team', express.static(path.join(publicPath, 'team')));
app.use('/developers', express.static(path.join(publicPath, 'public/developers')));

// Test endpoint to verify static file serving
app.get('/test-static', (req, res) => {
    const testFilePath = path.join(publicPath, 'team/team-1753964325134-321275799.png');
    const fileExists = fs.existsSync(testFilePath);
  
  res.json({
    publicPath,
    testFilePath,
    fileExists,
    filesInTeamDir: fileExists ? fs.readdirSync(path.join(publicPath, 'team')) : []
  });
});

// Initialize database
syncDatabase();

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Realtraspaces API' });
});

// API Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('OTP Service is running');
});
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/webusers', webuserRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/developers', developerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 