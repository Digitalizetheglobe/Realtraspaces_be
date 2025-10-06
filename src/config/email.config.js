const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration with environment variables
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'Info@realtraspaces.com',
        pass: process.env.SMTP_PASS || 'Rahul@23121984' // Your Zoho Mail password
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
            console.log('Zoho Mail authentication failed. Please check:');
            console.log('1. Verify your Zoho Mail credentials');
            console.log('2. Ensure SMTP is enabled in your Zoho Mail settings');
            console.log('3. Check if your Zoho Mail account supports SMTP');
            console.log('4. Update the SMTP_PASS with your correct Zoho password');
        }
    } else {
        console.log('Zoho Mail server is ready to send messages');
    }
});

module.exports = transporter;
