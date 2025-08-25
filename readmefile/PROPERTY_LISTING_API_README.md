# Property Listing API Documentation

## Overview
This API provides endpoints for managing property listings in the Real Estate Spaces platform. It includes CRUD operations, filtering, pagination, and status management.

## Base URL
```
https://api.realtraspaces.com/api/property-listings
```

## Endpoints

### 1. Create Property Listing
**POST** `/create`

Creates a new property listing.

**Request Body:**
```json
{
  "propertyName": "Premium Office Space",
  "location": "BKC, Mumbai",
  "propertyType": "Office",
  "transactionType": "Lease",
  "areaCarpet": "2000 sq ft",
  "areaBuiltup": "2500 sq ft",
  "rent": 50000,
  "price": null,
  "contactName": "John Doe",
  "contactNumber": "+91 9876543210",
  "emailAddress": "john@example.com",
  "description": "Premium office space in prime location",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property listing created successfully",
  "data": {
    "id": 1,
    "propertyName": "Premium Office Space",
    "location": "BKC, Mumbai",
    "propertyType": "Office",
    "transactionType": "Lease",
    "areaCarpet": "2000 sq ft",
    "areaBuiltup": "2500 sq ft",
    "rent": "50000.00",
    "price": null,
    "contactName": "John Doe",
    "contactNumber": "+91 9876543210",
    "emailAddress": "john@example.com",
    "description": "Premium office space in prime location",
    "imageUrl": "https://example.com/image.jpg",
    "status": "pending",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### 2. Get All Property Listings
**GET** `/all`

Retrieves all property listings with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (pending, approved, rejected, active, inactive)
- `propertyType` (optional): Filter by property type
- `transactionType` (optional): Filter by transaction type
- `location` (optional): Filter by location (partial match)
- `search` (optional): Search in property name, location, or description

**Example Request:**
```
GET /api/property-listings/all?page=1&limit=5&status=approved&propertyType=Office
```

**Response:**
```json
{
  "success": true,
  "message": "Property listings retrieved successfully",
  "data": {
    "listings": [
      {
        "id": 1,
        "propertyName": "Premium Office Space",
        "location": "BKC, Mumbai",
        "propertyType": "Office",
        "transactionType": "Lease",
        "areaCarpet": "2000 sq ft",
        "areaBuiltup": "2500 sq ft",
        "rent": "50000.00",
        "price": null,
        "contactName": "John Doe",
        "contactNumber": "+91 9876543210",
        "emailAddress": "john@example.com",
        "description": "Premium office space in prime location",
        "imageUrl": "https://example.com/image.jpg",
        "status": "approved",
        "isActive": true,
        "createdAt": "2025-01-15T10:00:00.000Z",
        "updatedAt": "2025-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 25,
      "itemsPerPage": 5
    }
  }
}
```

### 3. Get Property Listing by ID
**GET** `/:id`

Retrieves a specific property listing by its ID.

**Example Request:**
```
GET /api/property-listings/1
```

**Response:**
```json
{
  "success": true,
  "message": "Property listing retrieved successfully",
  "data": {
    "id": 1,
    "propertyName": "Premium Office Space",
    "location": "BKC, Mumbai",
    "propertyType": "Office",
    "transactionType": "Lease",
    "areaCarpet": "2000 sq ft",
    "areaBuiltup": "2500 sq ft",
    "rent": "50000.00",
    "price": null,
    "contactName": "John Doe",
    "contactNumber": "+91 9876543210",
    "emailAddress": "john@example.com",
    "description": "Premium office space in prime location",
    "imageUrl": "https://example.com/image.jpg",
    "status": "pending",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### 4. Update Property Listing
**PUT** `/:id`

Updates an existing property listing.

**Request Body:**
```json
{
  "propertyName": "Updated Office Space",
  "rent": 55000,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property listing updated successfully",
  "data": {
    "id": 1,
    "propertyName": "Updated Office Space",
    "location": "BKC, Mumbai",
    "propertyType": "Office",
    "transactionType": "Lease",
    "areaCarpet": "2000 sq ft",
    "areaBuiltup": "2500 sq ft",
    "rent": "55000.00",
    "price": null,
    "contactName": "John Doe",
    "contactNumber": "+91 9876543210",
    "emailAddress": "john@example.com",
    "description": "Updated description",
    "imageUrl": "https://example.com/image.jpg",
    "status": "pending",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T11:00:00.000Z"
  }
}
```

### 5. Delete Property Listing
**DELETE** `/:id`

Soft deletes a property listing (sets isActive to false).

**Example Request:**
```
DELETE /api/property-listings/1
```

**Response:**
```json
{
  "success": true,
  "message": "Property listing deleted successfully"
}
```

### 6. Delete All Property Listings
**DELETE** `/delete-all?confirm=true`

Soft deletes all property listings. Requires confirmation parameter.

**Example Request:**
```
DELETE /api/property-listings/delete-all?confirm=true
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully deleted 25 property listings"
}
```

### 7. Get Property Listings by Status
**GET** `/status/:status`

Retrieves property listings filtered by status.

**Example Request:**
```
GET /api/property-listings/status/pending?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Property listings with status 'pending' retrieved successfully",
  "data": {
    "listings": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

### 8. Update Property Listing Status
**PATCH** `/:id/status`

Updates the status of a property listing (admin function).

**Request Body:**
```json
{
  "status": "approved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property listing status updated successfully",
  "data": {
    "id": 1,
    "propertyName": "Premium Office Space",
    "status": "approved",
    "isActive": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

## Data Models

### Property Listing Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Integer | Auto | Primary key |
| propertyName | String | No | Name of the property |
| location | String | No | Property location |
| propertyType | Enum | Yes | Office, Retail, Coworking, Industrial or warehouse, Land, Others |
| transactionType | Enum | Yes | Lease, Sale, BOTH, Preleased |
| areaCarpet | String | Yes | Carpet area |
| areaBuiltup | String | Yes | Built-up area |
| rent | Decimal | Conditional | Required for Lease/BOTH |
| price | Decimal | Conditional | Required for Sale/Preleased/BOTH |
| contactName | String | Yes | Contact person name |
| contactNumber | String | Yes | Contact phone number |
| emailAddress | String | Yes | Contact email |
| description | Text | No | Property description |
| imageUrl | String | No | Property image URL |
| status | Enum | Auto | pending, approved, rejected, active, inactive |
| isActive | Boolean | Auto | Soft delete flag |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Last update timestamp |

## Validation Rules

1. **Required Fields**: propertyType, transactionType, areaCarpet, areaBuiltup, contactName, contactNumber, emailAddress
2. **Email Validation**: Must be a valid email format
3. **Transaction Type Validation**:
   - For "Lease" or "BOTH": rent is required
   - For "Sale", "Preleased", or "BOTH": price is required
4. **Status Values**: pending, approved, rejected, active, inactive

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Property listing not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

## Usage Examples

### Frontend Integration

```javascript
// Create a property listing
const createListing = async (listingData) => {
  try {
    const response = await fetch('/api/property-listings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listingData)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating listing:', error);
  }
};

// Get all listings with filters
const getListings = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`/api/property-listings/all?${queryParams}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
};

// Update listing status
const updateStatus = async (id, status) => {
  try {
    const response = await fetch(`/api/property-listings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating status:', error);
  }
};
```

## Database Migration

To create the property_listings table, run:

```bash
npx sequelize-cli db:migrate
```

The migration file is located at: `src/database/migrations/20250115000000_create_property_listings.js`
