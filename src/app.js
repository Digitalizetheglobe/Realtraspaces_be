const express = require('express');
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
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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