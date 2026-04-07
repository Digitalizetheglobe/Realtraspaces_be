# Cookie Policy API Documentation

This API provides endpoints for managing cookie policy acceptance in the Realtraspaces application.

## Base URL
```
http://localhost:8000/api/cookie-policy
```

## Endpoints

### 1. Accept Cookies Policy
**POST** `/accept`

Accepts the cookie policy for a user (authenticated or anonymous).

#### Request Body
```json
{
  "userId": 123,           // Optional: User ID if authenticated
  "sessionId": "abc123",   // Optional: Session ID for anonymous users
  "policyVersion": "1.0"   // Optional: Policy version (defaults to "1.0")
}
```

#### Response
```json
{
  "status": "success",
  "message": "Cookie policy accepted successfully",
  "data": {
    "accepted": true,
    "acceptedAt": "2024-01-15T10:30:00.000Z",
    "policyVersion": "1.0"
  }
}
```

#### Example Usage
```javascript
// Frontend usage
const acceptCookies = async () => {
  const response = await fetch('/api/cookie-policy/accept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: currentUser?.id, // If authenticated
      sessionId: sessionId,    // If anonymous
      policyVersion: '1.0'
    })
  });
  
  const result = await response.json();
  if (result.status === 'success') {
    // Update local storage or state
    localStorage.setItem('cookiesAccepted', 'true');
  }
};
```

### 2. Check Acceptance Status
**GET** `/check`

Checks if a user has already accepted the cookie policy.

#### Query Parameters
- `userId` (optional): User ID if authenticated
- `sessionId` (optional): Session ID for anonymous users

#### Response
```json
{
  "status": "success",
  "data": {
    "accepted": true,
    "acceptedAt": "2024-01-15T10:30:00.000Z",
    "policyVersion": "1.0"
  }
}
```

#### Example Usage
```javascript
// Frontend usage
const checkCookieAcceptance = async () => {
  const response = await fetch(`/api/cookie-policy/check?userId=${currentUser?.id}&sessionId=${sessionId}`);
  const result = await response.json();
  
  if (result.status === 'success' && result.data.accepted) {
    // User has already accepted cookies
    return true;
  }
  return false;
};
```

### 3. Get Statistics (Admin Only)
**GET** `/statistics`

Retrieves cookie policy acceptance statistics for administrative purposes.

#### Response
```json
{
  "status": "success",
  "data": {
    "totalAcceptances": 1250,
    "recentAcceptances": 45,
    "uniqueUsers": 1200
  }
}
```

### 4. Get All Records (Admin Only)
**GET** `/records`

Retrieves all cookie policy acceptance records with pagination.

#### Query Parameters
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

#### Response
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "userId": 123,
        "sessionId": "abc123",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "accepted": true,
        "acceptedAt": "2024-01-15T10:30:00.000Z",
        "policyVersion": "1.0",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "user": {
          "id": 123,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "total": 1250,
    "limit": 50,
    "offset": 0
  }
}
```

## Database Schema

### CookiePolicy Model
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  userId: INTEGER (Foreign Key to users.id, nullable),
  sessionId: STRING (nullable),
  ipAddress: STRING (required),
  userAgent: TEXT (nullable),
  accepted: BOOLEAN (default: true),
  acceptedAt: DATE (default: current timestamp),
  policyVersion: STRING (default: "1.0"),
  createdAt: DATE,
  updatedAt: DATE
}
```

## Features

### User Identification
- **Authenticated Users**: Uses `userId` to track cookie acceptance
- **Anonymous Users**: Uses `sessionId` to track cookie acceptance
- **IP Tracking**: Automatically captures IP address for compliance
- **User Agent**: Captures browser information for analytics

### Compliance Features
- **Policy Versioning**: Tracks which version of the policy was accepted
- **Timestamp Tracking**: Records when the policy was accepted
- **Audit Trail**: Maintains complete history of acceptances

### Security Features
- **IP Address Validation**: Ensures IP address is captured
- **Duplicate Prevention**: Updates existing records instead of creating duplicates
- **Data Privacy**: Only stores necessary information for compliance

## Integration with Frontend

### React Component Integration
```javascript
// Updated CookiesBanner component
const CookiesBanner = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAcceptanceStatus();
  }, []);

  const checkAcceptanceStatus = async () => {
    try {
      const response = await fetch('/api/cookie-policy/check');
      const result = await response.json();
      
      if (result.status === 'success' && !result.data.accepted) {
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking cookie acceptance:', error);
      setVisible(true); // Show banner if check fails
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cookie-policy/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: generateSessionId(), // Generate unique session ID
          policyVersion: '1.0'
        })
      });
      
      const result = await response.json();
      if (result.status === 'success') {
        setVisible(false);
        localStorage.setItem('cookiesAccepted', 'true');
      }
    } catch (error) {
      console.error('Error accepting cookies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="cookies-banner">
      <span>We use cookies to improve your experience...</span>
      <button 
        onClick={handleAccept} 
        disabled={loading}
      >
        {loading ? 'Accepting...' : 'Accept'}
      </button>
    </div>
  );
};
```

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "status": "error",
  "message": "IP address is required"
}
```

#### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Database connection error"
}
```

## Best Practices

1. **Always check acceptance status** before showing the cookie banner
2. **Use session IDs** for anonymous users to avoid showing the banner repeatedly
3. **Handle errors gracefully** and fall back to showing the banner if the API is unavailable
4. **Store acceptance locally** as a backup to the server-side record
5. **Update policy version** when making changes to the cookie policy
6. **Monitor statistics** regularly to ensure compliance

## Security Considerations

1. **Rate Limiting**: Consider implementing rate limiting on the accept endpoint
2. **Authentication**: Add authentication middleware for admin endpoints
3. **Data Retention**: Implement data retention policies for cookie acceptance records
4. **GDPR Compliance**: Ensure the API supports GDPR requirements for data deletion
5. **HTTPS**: Always use HTTPS in production to protect user data
