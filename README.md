# Realtraspaces Backend API

A Node.js RESTful API built with Express and Sequelize.

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Custom middlewares
├── utils/          # Utility functions
└── app.js          # Main application file
```

## Features

- RESTful API architecture
- MySQL database with Sequelize ORM
- Error handling middleware
- Request logging
- CORS enabled
- Environment variables configuration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the environment variables:
   ```
   PORT=8000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=realtraspaces_db
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Development

To start the development server with nodemon:

```bash
npm run dev
```

## License

This project is licensed under the MIT License.