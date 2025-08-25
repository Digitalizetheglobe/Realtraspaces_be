# Admin Authentication System

This module provides a complete authentication system for admin users with registration, login, and CRUD operations.

## Setup

1. Install the required dependencies:
   ```bash
   npm install bcryptjs jsonwebtoken mongoose
   ```

2. Add the following environment variables to your `.env` file:
   ```
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Run the migration to create the admins collection:
   ```bash
   node migrations/20250728_create_admins_table.js
   ```

## API Endpoints

### Authentication
- `POST /api/v1/admins/register` - Register a new admin
- `POST /api/v1/admins/login` - Login admin

### Protected Routes (Requires JWT Token)
- `GET /api/v1/admins/me` - Get current admin profile
- `GET /api/v1/admins` - Get all admins (Superadmin only)
- `GET /api/v1/admins/:id` - Get admin by ID
- `PATCH /api/v1/admins/:id` - Update admin
- `DELETE /api/v1/admins/:id` - Delete admin (Superadmin only)

## Default Superadmin

A default superadmin is created during the first migration:
- Mobile: 9999999999
- Password: admin@123

## Request Examples

### Register Admin
```http
POST /api/v1/admins/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "mobileNumber": "9876543210",
  "password": "password123",
  "role": "admin"
}
```

### Login
```http
POST /api/v1/admins/login
Content-Type: application/json

{
  "mobileNumber": "9876543210",
  "password": "password123"
}
```

### Get All Admins (Superadmin only)
```http
GET /api/v1/admins
Authorization: Bearer your_jwt_token_here
```

## Security
- Passwords are hashed using bcrypt before saving to the database
- JWT tokens are used for authentication
- Role-based access control is implemented
- Password is never sent in responses

## Error Handling
All error responses follow the format:
```json
{
  "status": "error",
  "message": "Error message here"
}
```
