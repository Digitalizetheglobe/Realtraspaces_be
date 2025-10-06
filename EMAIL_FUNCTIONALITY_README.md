# Email Functionality Implementation

This document describes the email functionality implemented for the Realtraspaces backend to send thank you emails to newly registered web users.

## Overview

The email system automatically sends two types of emails when a user registers:

1. **Welcome Email** - Sent to the newly registered user
2. **Admin Notification Email** - Sent to the admin (Info@realtraspaces.com) notifying about the new registration

## Email Configuration

### Credentials Used
- **Email**: Info@realtraspaces.com
- **Password**: Rahul@23121984
- **SMTP Server**: smtp.gmail.com
- **Port**: 587
- **Security**: TLS (not SSL)

### Configuration File
The email configuration is stored in `src/config/email.config.js`:

```javascript
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'Info@realtraspaces.com',
        pass: 'Rahul@23121984'
    },
    tls: {
        rejectUnauthorized: false
    }
};
```

## Email Service

### Location
The email service is implemented in `src/services/emailService.js`

### Key Features
- **Welcome Email**: Beautiful HTML email with user details and company branding
- **Admin Notification**: HTML notification with complete user registration details
- **Error Handling**: Graceful error handling that doesn't break user registration
- **Template System**: Separate HTML and text versions of emails
- **Logging**: Comprehensive logging for debugging

### Methods Available

#### `sendWelcomeEmail(userData)`
Sends a welcome email to newly registered users.

**Parameters:**
- `userData.fullName` - User's full name
- `userData.email` - User's email address
- `userData.location` - User's location
- `userData.company` - User's company

**Returns:**
```javascript
{
    success: true/false,
    messageId: "email-message-id" // if successful
    error: "error-message" // if failed
}
```

#### `sendAdminNotificationEmail(userData)`
Sends notification email to admin about new registration.

**Parameters:**
- `userData.fullName` - User's full name
- `userData.email` - User's email address
- `userData.location` - User's location
- `userData.company` - User's company
- `userData.mobileNumber` - User's mobile number

## Integration with Webuser Registration

### Updated Controller
The `webuser.controller.js` has been updated to include email functionality:

```javascript
// After successful user creation
const emailResult = await emailService.sendWelcomeEmail({
    fullName: user.fullName,
    email: user.email,
    location: user.location,
    company: user.company
});

// Send admin notification
const adminEmailResult = await emailService.sendAdminNotificationEmail({
    fullName: user.fullName,
    email: user.email,
    location: user.location,
    company: user.company,
    mobileNumber: user.mobileNumber
});
```

### Error Handling
- Email failures do not affect user registration
- All email errors are logged for debugging
- Registration proceeds even if emails fail

## Email Templates

### Welcome Email Features
- **Professional Design**: Clean, modern HTML layout
- **Company Branding**: Realtraspaces logo and colors
- **User Details**: Personalized with user's registration information
- **Call-to-Action**: Button to visit the website
- **Features List**: Highlights of the platform
- **Responsive**: Works on desktop and mobile devices

### Admin Notification Features
- **Complete User Info**: All registration details in organized format
- **Timestamp**: Registration date and time
- **Professional Layout**: Clean, easy-to-read format
- **Quick Reference**: All user details at a glance

## Testing

### Test Script
A test script is available at `test-email-functionality.js` to verify email functionality.

**To run the test:**
```bash
cd Realtraspaces_be
node test-email-functionality.js
```

**Before running the test:**
1. Update the test email address in the script to your email
2. Ensure the backend is properly configured
3. Verify email credentials are correct

### Test Features
- Tests both welcome and admin notification emails
- Provides detailed success/failure reporting
- Shows message IDs for successful sends
- Comprehensive error logging

## Dependencies

### Required Packages
- **nodemailer**: For sending emails
- **Existing packages**: jwt, bcryptjs, sequelize (already installed)

### Installation
```bash
npm install nodemailer
```

## Security Considerations

### Email Credentials
- Credentials are hardcoded for now (consider using environment variables for production)
- Consider using app-specific passwords for Gmail
- Implement proper secret management for production deployment

### Gmail Setup
- Ensure "Less secure app access" is enabled or use app-specific passwords
- Consider implementing OAuth2 for better security

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify email credentials
   - Check Gmail security settings
   - Ensure app-specific password is used

2. **Connection Timeout**
   - Check network connectivity
   - Verify SMTP server settings
   - Check firewall settings

3. **Email Not Received**
   - Check spam/junk folders
   - Verify recipient email address
   - Check Gmail sending limits

### Debug Logging
All email operations are logged to the console:
- Successful sends show message IDs
- Failed sends show error details
- Connection verification on startup

## Production Considerations

### Environment Variables
Consider moving email configuration to environment variables:

```javascript
const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
```

### Email Queue
For high-volume applications, consider implementing:
- Email queue system (Redis, Bull)
- Retry mechanisms for failed emails
- Email templates stored in database
- Rate limiting for email sending

### Monitoring
Implement monitoring for:
- Email delivery rates
- Failed email attempts
- Email service uptime
- User engagement with emails

## API Endpoints

### Registration Endpoint
**POST** `/api/webusers/register`

**Request Body:**
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "9876543210",
    "location": "Mumbai",
    "company": "Test Company",
    "password": "password123"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com",
        "mobileNumber": "9876543210",
        "token": "jwt-token-here"
    }
}
```

**Email Actions:**
- Welcome email sent to user's email
- Admin notification sent to Info@realtraspaces.com

## Support

For issues or questions regarding the email functionality:
1. Check the console logs for error messages
2. Run the test script to verify configuration
3. Verify Gmail account settings and credentials
4. Check network connectivity and firewall settings

## Future Enhancements

Potential improvements:
1. Email templates customization through admin panel
2. Email preferences for users
3. Email analytics and tracking
4. Multiple email providers for redundancy
5. Email scheduling and automation
6. A/B testing for email templates
