const transporter = require('../config/email.config');

class EmailService {
    constructor() {
        // Use SMTP_FROM if provided, otherwise fall back to the actual SMTP user.
        // This avoids "553 Sender is not allowed to relay emails" errors where
        // the FROM address does not match the authenticated SMTP account.
        this.fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
        this.companyName = 'Realtraspaces';
    }

    /**
     * Send welcome/thank you email to newly registered webuser
     * @param {Object} userData - User registration data
     * @param {string} userData.fullName - User's full name
     * @param {string} userData.email - User's email address
     * @param {string} userData.location - User's location
     * @param {string} userData.company - User's company
     */
    async sendWelcomeEmail(userData) {
        try {
            const { fullName, email, location, company } = userData;

            const mailOptions = {
                from: `"${this.companyName}" <${this.fromEmail}>`,
                to: email,
                subject: `Welcome to ${this.companyName} - Thank You for Registering!`,
                html: this.getWelcomeEmailTemplate(userData),
                text: this.getWelcomeEmailText(userData)
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get HTML template for welcome email
     */
    getWelcomeEmailTemplate(userData) {
        const { fullName, location, company } = userData;
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Realtra Spaces</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .welcome-title {
            color: #1a1a1a;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 30px;
        }
        .highlight {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            margin: 20px 0;
        }
        .features {
            margin: 20px 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            background-color: #f8fafc;
            border-radius: 6px;
        }
        .feature-icon {
            margin-right: 10px;
            font-size: 18px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏢 Realtra Spaces</div>
            <h1 class="welcome-title">Welcome to Realtra Spaces!</h1>
        </div>

        <div class="content">
            <p>Dear <strong>${fullName}</strong>,</p>
            
            <p>Thank you for registering with Realtra Spaces! We're excited to have you join our community of property enthusiasts and help you find your perfect property.</p>

            <div class="highlight">
                <h3>Your Registration Details:</h3>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Company:</strong> ${company}</p>
            </div>

            <h3>What's Next?</h3>
            <div class="features">
                <div class="feature-item">
                    <span class="feature-icon">🏠</span>
                    <span>Browse our premium property listings</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">❤️</span>
                    <span>Get personalized property recommendations</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📊</span>
                    <span>Access exclusive market insights</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🔍</span>
                    <span>Compare properties and save favorites</span>
                </div>
            </div>

            <p>Ready to start your property journey?</p>
            <div style="text-align: center;">
                <a href="https://realtraspaces.com" class="cta-button">Explore Properties</a>
            </div>

            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>

            <p>Best regards,<br>
            <strong>The Realtra Spaces Team</strong></p>
        </div>

        <div class="footer">
            <p>© 2025 Realtra Spaces. All rights reserved.</p>
            <p>This email was sent to ${userData.email}. If you didn't register for Realtra Spaces, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Get plain text version of welcome email
     */
    getWelcomeEmailText(userData) {
        const { fullName, location, company, email } = userData;
        return `
Welcome to Realtra Spaces!

Dear ${fullName},

Thank you for registering with Realtra Spaces! We're excited to have you join our community of property enthusiasts and help you find your perfect property.

Your Registration Details:
- Name: ${fullName}
- Location: ${location}
- Company: ${company}

What's Next?
• Browse our premium property listings
• Get personalized property recommendations
• Access exclusive market insights
• Compare properties and save favorites

Ready to start your property journey?
Visit: https://realtraspaces.com

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The Realtra Spaces Team

© 2025 Realtra Spaces. All rights reserved.
This email was sent to ${email}. If you didn't register for Realtra Spaces, please ignore this email.
        `;
    }

    /**
     * Send notification email to admin about new registration
     * @param {Object} userData - User registration data
     */
    async sendAdminNotificationEmail(userData) {
        try {
            const { fullName, email, location, company, mobileNumber } = userData;

            const mailOptions = {
                from: `"${this.companyName}" <${this.fromEmail}>`,
                to: this.fromEmail,
                subject: `New User Registration - ${fullName}`,
                html: this.getAdminNotificationTemplate(userData),
                text: this.getAdminNotificationText(userData)
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Admin notification email sent successfully:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending admin notification email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get HTML template for admin notification email
     */
    getAdminNotificationTemplate(userData) {
        const { fullName, email, location, company, mobileNumber } = userData;
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: #dc2626;
        }
        .user-details {
            background-color: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
            margin: 20px 0;
        }
        .detail-row {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #374151;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 New User Registration Alert</h1>
            <p>A new user has registered on Realtra Spaces</p>
        </div>

        <div class="user-details">
            <h3>User Details:</h3>
            <div class="detail-row">
                <span class="detail-label">Full Name:</span> ${fullName}
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span> ${email}
            </div>
            <div class="detail-row">
                <span class="detail-label">Mobile:</span> ${mobileNumber}
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span> ${location}
            </div>
            <div class="detail-row">
                <span class="detail-label">Company:</span> ${company}
            </div>
            <div class="detail-row">
                <span class="detail-label">Registration Date:</span> ${new Date().toLocaleString()}
            </div>
        </div>

        <p>Please review the user details and take any necessary actions.</p>

        <p>Best regards,<br>
        Realtra Spaces System</p>
    </div>
</body>
</html>
        `;
    }

    /**
     * Get plain text version of admin notification email
     */
    getAdminNotificationText(userData) {
        const { fullName, email, location, company, mobileNumber } = userData;
        return `
New User Registration Alert

A new user has registered on Realtra Spaces

User Details:
- Full Name: ${fullName}
- Email: ${email}
- Mobile: ${mobileNumber}
- Location: ${location}
- Company: ${company}
- Registration Date: ${new Date().toLocaleString()}

Please review the user details and take any necessary actions.

Best regards,
Realtra Spaces System
        `;
    }

    /**
     * Send OTP email to user
     * @param {Object} otpData - OTP data
     * @param {string} otpData.fullName - User's full name (for registration)
     * @param {string} otpData.email - User's email address
     * @param {string} otpData.otpCode - 6-digit OTP code
     * @param {string} otpData.type - 'registration' or 'login'
     */
    async sendOtpEmail(otpData) {
        try {
            const { fullName, email, otpCode, type } = otpData;

            const mailOptions = {
                from: `"${this.companyName}" <${this.fromEmail}>`,
                to: email,
                subject: `${type === 'registration' ? 'Complete Your Registration' : 'Login Verification'} - ${this.companyName}`,
                html: this.getOtpEmailTemplate(otpData),
                text: this.getOtpEmailText(otpData)
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('OTP email sent successfully:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending OTP email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get HTML template for OTP email
     */
    getOtpEmailTemplate(otpData) {
        const { fullName, email, otpCode, type } = otpData;
        const isRegistration = type === 'registration';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isRegistration ? 'Complete Your Registration' : 'Login Verification'} - Realtra Spaces</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .otp-container {
            background-color: #eff6ff;
            padding: 30px;
            border-radius: 12px;
            border: 2px solid #2563eb;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background-color: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏢 Realtra Spaces</div>
            <h1>${isRegistration ? 'Complete Your Registration' : 'Login Verification'}</h1>
        </div>

        <div class="content">
            ${isRegistration ? `<p>Dear <strong>${fullName}</strong>,</p>` : ''}
            
            <p>${isRegistration ? 'Thank you for registering with Realtra Spaces! To complete your registration, please use the OTP below:' : 'To complete your login, please use the OTP below:'}</p>

            <div class="otp-container">
                <h3>Your Verification Code</h3>
                <div class="otp-code">${otpCode}</div>
                <p>This code will expire in 10 minutes</p>
            </div>

            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                    <li>Never share this OTP with anyone</li>
                    <li>Realtra Spaces will never ask for your OTP via phone or email</li>
                    <li>If you didn't request this ${isRegistration ? 'registration' : 'login'}, please ignore this email</li>
                </ul>
            </div>

            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>

            <p>Best regards,<br>
            <strong>The Realtra Spaces Team</strong></p>
        </div>

        <div class="footer">
            <p>© 2025 Realtra Spaces. All rights reserved.</p>
            <p>This email was sent to ${email}. If you didn't request this ${isRegistration ? 'registration' : 'login'}, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Get plain text version of OTP email
     */
    getOtpEmailText(otpData) {
        const { fullName, email, otpCode, type } = otpData;
        const isRegistration = type === 'registration';
        
        return `
${isRegistration ? 'Complete Your Registration' : 'Login Verification'} - Realtra Spaces

${isRegistration ? `Dear ${fullName},` : ''}

${isRegistration ? 'Thank you for registering with Realtra Spaces! To complete your registration, please use the OTP below:' : 'To complete your login, please use the OTP below:'}

Your Verification Code: ${otpCode}

This code will expire in 10 minutes.

Security Notice:
- Never share this OTP with anyone
- Realtra Spaces will never ask for your OTP via phone or email
- If you didn't request this ${isRegistration ? 'registration' : 'login'}, please ignore this email

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The Realtra Spaces Team

© 2025 Realtra Spaces. All rights reserved.
This email was sent to ${email}. If you didn't request this ${isRegistration ? 'registration' : 'login'}, please ignore this email.
        `;
    }
}

module.exports = new EmailService();
