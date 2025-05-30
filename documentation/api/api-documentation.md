# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Authentication is handled using JWT (JSON Web Tokens). Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": "string"
}
```

### Users

#### GET /users/profile
Get current user's profile.

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "createdAt": "string"
}
```

#### PUT /users/profile
Update current user's profile.

**Request Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

## Error Responses
All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting
API requests are limited to 100 requests per minute per IP address.

## Data Types

### User Object
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "createdAt": "string (ISO 8601 date)",
  "updatedAt": "string (ISO 8601 date)"
}
```

## Versioning
The API version is included in the URL path. Current version is v1:
```
http://localhost:3000/api/v1/
``` 