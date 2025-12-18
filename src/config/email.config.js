const nodemailer = require('nodemailer');
require('dotenv').config();

const emailConfig = {
    // All values must come from environment variables to avoid hardcoding secrets
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration with better error handling
transporter.verify((error, success) => {
    if (error) {
        console.log('Email configuration error:', error.message);
        if (error.code === 'EAUTH') {
            console.log('SMTP authentication failed. Please check:');
            console.log('1. Verify your SMTP credentials (email + password/app password)');
            console.log('2. Ensure SMTP is enabled in your email provider settings');
            console.log('3. For Gmail, use an App Password (not your normal login password)');
            console.log('4. Update SMTP_PASS with the correct password/app password');
        }
    } else {
        console.log('SMTP server is ready to send messages');
    }
});

module.exports = transporter;
