# Developer Images API Documentation

This document describes the enhanced Developer API with support for multiple images and logo management.

## Overview

The Developer API now supports:
- Single logo upload for each developer
- Multiple images upload (up to 10 images per developer)
- Individual image deletion
- Automatic file cleanup when developers are deleted

## Database Changes

### New Field Added
- `images`: JSON field storing an array of image URLs

### Migration
Run the migration to add the images field to existing developers table:
```bash
npx sequelize-cli db:migrate
```

## API Endpoints

### 1. Create Developer
**POST** `/api/developers`

Creates a new developer with optional logo upload.

**Request Body (multipart/form-data):**
```javascript
{
  buildername: "Developer Name",
  descriptions: "Developer description",
  project_name: ["Project 1", "Project 2"],
  builder_logo: [file] // Optional logo file
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Developer created successfully",
  "data": {
    "id": 1,
    "buildername": "Developer Name",
    "builder_logo": "http://localhost:8000/developers/developer-1234567890.jpg",
    "descriptions": "Developer description",
    "project_name": ["Project 1", "Project 2"],
    "images": [],
    "status": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Upload Multiple Images
**POST** `/api/developers/:id/images`

Upload multiple images for a specific developer.

**Request Body (multipart/form-data):**
```javascript
{
  images: [file1, file2, file3, ...] // Up to 10 image files
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "uploadedImages": [
      "http://localhost:8000/developers/developer-1234567890.jpg",
      "http://localhost:8000/developers/developer-1234567891.jpg"
    ],
    "totalImages": [
      "http://localhost:8000/developers/developer-1234567890.jpg",
      "http://localhost:8000/developers/developer-1234567891.jpg"
    ]
  }
}
```

### 3. Get All Developers
**GET** `/api/developers`

Retrieves all developers with their images.

**Query Parameters:**
- `search`: Optional search term for buildername or descriptions

**Response:**
```javascript
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "buildername": "Developer Name",
      "builder_logo": "http://localhost:8000/developers/developer-1234567890.jpg",
      "descriptions": "Developer description",
      "project_name": ["Project 1", "Project 2"],
      "images": [
        "http://localhost:8000/developers/developer-1234567891.jpg",
        "http://localhost:8000/developers/developer-1234567892.jpg"
      ],
      "status": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Get Developer by ID
**GET** `/api/developers/:id`

Retrieves a specific developer by ID.

**Response:**
```javascript
{
  "success": true,
  "data": {
    "id": 1,
    "buildername": "Developer Name",
    "builder_logo": "http://localhost:8000/developers/developer-1234567890.jpg",
    "descriptions": "Developer description",
    "project_name": ["Project 1", "Project 2"],
    "images": [
      "http://localhost:8000/developers/developer-1234567891.jpg",
      "http://localhost:8000/developers/developer-1234567892.jpg"
    ],
    "status": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Update Developer
**PUT** `/api/developers/:id`

Updates a developer with optional logo upload.

**Request Body (multipart/form-data or JSON):**
```javascript
{
  buildername: "Updated Developer Name",
  descriptions: "Updated description",
  project_name: ["Updated Project 1", "Updated Project 2"],
  images: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  status: true,
  builder_logo: [file] // Optional new logo file
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Developer updated successfully",
  "data": {
    "id": 1,
    "buildername": "Updated Developer Name",
    "builder_logo": "http://localhost:8000/developers/developer-1234567890.jpg",
    "descriptions": "Updated description",
    "project_name": ["Updated Project 1", "Updated Project 2"],
    "images": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
    "status": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Delete Specific Image
**DELETE** `/api/developers/:id/images/:imageIndex`

Deletes a specific image from a developer by its index in the images array.

**Response:**
```javascript
{
  "success": true,
  "message": "Image deleted successfully",
  "data": {
    "remainingImages": [
      "http://localhost:8000/developers/developer-1234567892.jpg"
    ]
  }
}
```

### 7. Delete Developer
**DELETE** `/api/developers/:id`

Deletes a developer and all associated files (logo and images).

**Response:**
```javascript
{
  "success": true,
  "message": "Developer deleted successfully"
}
```

## File Storage

### Directory Structure
```
public/
└── developers/
    ├── developer-1234567890.jpg
    ├── developer-1234567891.jpg
    └── developer-1234567892.jpg
```

### File Naming Convention
- Files are named with prefix: `developer-`
- Unique timestamp and random number suffix
- Original file extension preserved

### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### File Size Limits
- Maximum file size: 5MB per file
- Maximum files per upload: 10 images

## Error Handling

### Common Error Responses

**File Type Error:**
```javascript
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, JPG, GIF, and WebP are allowed."
}
```

**File Size Error:**
```javascript
{
  "success": false,
  "message": "File too large"
}
```

**Developer Not Found:**
```javascript
{
  "success": false,
  "message": "Developer not found"
}
```

**Invalid Image Index:**
```javascript
{
  "success": false,
  "message": "Invalid image index"
}
```

## Frontend Integration Examples

### Upload Multiple Images
```javascript
const uploadImages = async (developerId, imageFiles) => {
  const formData = new FormData();
  
  imageFiles.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch(`/api/developers/${developerId}/images`, {
    method: 'POST',
    body: formData
  });

  return await response.json();
};
```

### Display Images
```javascript
const displayDeveloperImages = (developer) => {
  return developer.images.map((imageUrl, index) => (
    <div key={index}>
      <img src={imageUrl} alt={`Developer image ${index + 1}`} />
      <button onClick={() => deleteImage(developer.id, index)}>
        Delete Image
      </button>
    </div>
  ));
};
```

### Delete Image
```javascript
const deleteImage = async (developerId, imageIndex) => {
  const response = await fetch(`/api/developers/${developerId}/images/${imageIndex}`, {
    method: 'DELETE'
  });

  return await response.json();
};
```

## Testing

Run the test file to verify the API functionality:
```bash
node test-developer-images.js
```

## Security Considerations

1. **File Validation**: Only image files are allowed
2. **File Size Limits**: Prevents large file uploads
3. **File Count Limits**: Prevents abuse with too many files
4. **Automatic Cleanup**: Files are deleted when developers are removed
5. **Unique Filenames**: Prevents filename conflicts

## Migration Notes

- Existing developers will have an empty `images` array
- The migration is backward compatible
- No data loss occurs during migration
