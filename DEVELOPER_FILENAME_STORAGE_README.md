# Developer API - Filename Storage Implementation

## Overview

The Developer API has been updated to store only image filenames in the database instead of full URLs. This is a better practice for database design and provides more flexibility.

## Changes Made

### 1. Model Updates (`src/models/developer.model.js`)

- **Updated validation for `builder_logo`**: Now validates that only filenames are stored, not URLs
- **Updated validation for `images`**: Now validates that the array contains only filenames, not URLs
- **Added URL detection**: Validation prevents storing URLs containing `http://` or `https://`

### 2. Controller Updates (`src/controllers/developer.controller.js`)

#### Helper Functions Added:
- `constructImageUrl(req, filename)`: Converts filename to full URL for API responses
- `extractFilenameFromUrl(url)`: Extracts filename from URL if needed
- `addUrlsToDeveloper(req, developer)`: Adds URL fields to developer data for API responses

#### Updated Functions:
- **`createDeveloper`**: Now stores only `req.file.filename` instead of full URL
- **`getAllDevelopers`**: Returns developers with both filename and URL fields
- **`getDeveloperById`**: Returns developer with both filename and URL fields
- **`updateDeveloper`**: Handles both filename and URL inputs, converts URLs to filenames
- **`uploadImages`**: Stores only filenames, returns URLs in response
- **`deleteImage`**: Works with filenames, returns URLs in response
- **`deleteDeveloper`**: Deletes files using filenames

## Database Schema

### Before:
```json
{
  "builder_logo": "http://localhost:3000/developers/developer-1234567890.jpg",
  "images": [
    "http://localhost:3000/developers/developer-1234567891.jpg",
    "http://localhost:3000/developers/developer-1234567892.jpg"
  ]
}
```

### After:
```json
{
  "builder_logo": "developer-1234567890.jpg",
  "images": [
    "developer-1234567891.jpg",
    "developer-1234567892.jpg"
  ]
}
```

## API Response Format

The API now returns both filename and URL fields:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "buildername": "Test Developer",
    "builder_logo": "developer-1234567890.jpg",
    "builder_logo_url": "http://localhost:3000/developers/developer-1234567890.jpg",
    "images": [
      "developer-1234567891.jpg",
      "developer-1234567892.jpg"
    ],
    "image_urls": [
      "http://localhost:3000/developers/developer-1234567891.jpg",
      "http://localhost:3000/developers/developer-1234567892.jpg"
    ]
  }
}
```

## Benefits

1. **Database Efficiency**: Smaller storage footprint
2. **Flexibility**: Easy to change domain/host without database updates
3. **Portability**: Database can be moved between environments easily
4. **Security**: No hardcoded URLs in database
5. **Maintainability**: Centralized URL construction logic

## Migration Notes

### For Existing Data:
If you have existing developers with full URLs in the database, you'll need to migrate the data:

```sql
-- Extract filenames from existing URLs
UPDATE developers 
SET builder_logo = SUBSTRING_INDEX(builder_logo, '/', -1)
WHERE builder_logo LIKE 'http%';

-- For images array, you'll need to update each JSON array
-- This is more complex and may require a script
```

### Testing:
Use the provided test script `test-developer-filenames.js` to verify the implementation:

```bash
node test-developer-filenames.js
```

## File Structure

```
src/
├── models/
│   └── developer.model.js          # Updated validation
├── controllers/
│   └── developer.controller.js     # Updated to store filenames
└── middleware/
    └── developerUpload.js          # No changes needed
```

## API Endpoints

All existing endpoints remain the same, but now:
- **Input**: Accepts both filenames and URLs (URLs are converted to filenames)
- **Storage**: Only filenames are stored in database
- **Output**: Returns both filename and URL fields for convenience

## Error Handling

The validation now prevents:
- Storing full URLs in the database
- Invalid file types
- Non-string values for image fields

## Future Considerations

1. **CDN Integration**: Easy to modify `constructImageUrl` to use CDN URLs
2. **Environment Variables**: Can use different base URLs for different environments
3. **Image Optimization**: Can add image processing before storage
4. **Backup Strategy**: Filenames make it easier to backup and restore files
