# Gmail Setup Instructions for Email Functionality

## Current Issue
The email functionality is implemented but requires proper Gmail authentication setup. The error indicates that the credentials are not accepted by Gmail.

## Gmail Authentication Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App-Specific Password
1. Go to Google Account settings
2. Navigate to Security → 2-Step Verification → App passwords
3. Select "Mail" as the app
4. Generate a 16-character app-specific password
5. Use this password instead of your regular Gmail password

### Step 3: Update Email Configuration
Replace the password in `src/config/email.config.js`:

```javascript
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'Info@realtraspaces.com',
        pass: 'YOUR_APP_SPECIFIC_PASSWORD_HERE' // Replace with app-specific password
    },
    tls: {
        rejectUnauthorized: false
    }
};
```

### Alternative: Use OAuth2 (Recommended for Production)
For better security, consider implementing OAuth2 authentication:

```javascript
const emailConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        type: 'OAuth2',
        user: 'Info@realtraspaces.com',
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
        refreshToken: 'YOUR_REFRESH_TOKEN',
        accessToken: 'YOUR_ACCESS_TOKEN'
    }
};
```

## Testing After Setup

1. Update the email configuration with the app-specific password
2. Run the test script:
   ```bash
   cd Realtraspaces_be
   node test-email-functionality.js
   ```

3. Check the console for success messages
4. Verify emails are received in the inbox (and spam folder)

## Troubleshooting

### If App-Specific Password Doesn't Work:
1. Ensure 2FA is enabled
2. Try generating a new app-specific password
3. Check that "Less secure app access" is disabled (it should be for 2FA accounts)
4. Verify the email address is correct

### If Still Having Issues:
1. Check Gmail's sending limits
2. Verify the account isn't locked
3. Try with a different Gmail account
4. Consider using a dedicated email service (SendGrid, Mailgun, etc.)

## Production Recommendations

1. **Use Environment Variables**: Store credentials in environment variables
2. **Use Email Service Provider**: Consider using professional email services
3. **Implement Rate Limiting**: Add email sending rate limits
4. **Add Email Queue**: Implement background job processing for emails
5. **Monitor Delivery**: Track email delivery rates and bounces

## Environment Variables Setup

Create a `.env` file in the project root:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=Info@realtraspaces.com
SMTP_PASS=your_app_specific_password_here
```

Then update the email config to use environment variables:

```javascript
require('dotenv').config();

const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
};
```

## Security Notes

- Never commit app-specific passwords to version control
- Use environment variables for all sensitive data
- Consider rotating passwords regularly
- Monitor email sending for suspicious activity
- Implement proper error handling and logging
