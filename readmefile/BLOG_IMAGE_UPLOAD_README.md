# Blog Image Upload Functionality

This document explains how the blog image upload system works in the Realtraspaces backend.

## Overview

The blog system now supports image uploads with the following features:
- Multiple image uploads (up to 5 images per blog)
- Image storage in `public/blogImages/` directory
- Image filenames stored in database as JSON array
- Automatic cleanup of uploaded images if blog creation fails
- Support for common image formats (JPEG, PNG, GIF)
- File size limit: 5MB per image

## Backend Implementation

### File Upload Middleware
- **Location**: `src/utils/fileUpload.js`
- **Function**: `uploadBlogImages`
- **Features**: 
  - Creates unique filenames with timestamp and random suffix
  - Validates file types (only images allowed)
  - Sets file size limits
  - Creates upload directory if it doesn't exist

### Blog Controller
- **Location**: `src/controllers/blog.controller.js`
- **Methods**:
  - `create`: Handles blog creation with image uploads
  - `update`: Handles blog updates with image uploads
  - `serveImage`: Serves individual blog images by filename
  - Automatic cleanup of old images when updating

### Blog Service
- **Location**: `src/services/blog.service.js`
- **Features**:
  - Handles image cleanup operations
  - Manages image arrays in database
  - Validates dynamic fields

### Database Model
- **Location**: `src/models/blog.model.js`
- **Image Field**: `blogImages` (JSON type, stores array of filenames)
- **Default**: Empty array `[]`

## API Endpoints

### Create Blog with Images
```
POST /api/blogs/
Content-Type: multipart/form-data

Fields:
- blogTitle: string (required)
- blogDescription: string (required)
- blogContent: string (required)
- writer: string (required)
- category: string (required)
- tags: string (comma-separated)
- slug: string (required)
- images: File[] (multiple image files)
```

### Update Blog with Images
```
PUT /api/blogs/:id
Content-Type: multipart/form-data

Fields: Same as create, plus:
- blogImages: string[] (optional, to replace all images)
```

### Get Blog Image
```
GET /api/blogs/image/:filename
```
Returns the image file directly.

### Static Image Access
```
GET /blogImages/:filename
```
Direct access to uploaded images via static file serving.

## Frontend Implementation

### React Component
- **Location**: `realtraspaces_fe/src/app/blog/create/page.tsx`
- **Features**:
  - Drag & drop image upload
  - Image preview before upload
  - Multiple image selection
  - FormData submission for multipart/form-data

### Image Utilities
- **Location**: `realtraspaces_fe/src/utils/imageUtils.ts`
- **Functions**:
  - `getBlogImageUrl(filename)`: Get static image URL
  - `getBlogImageApiUrl(filename)`: Get API image URL
  - `getBlogImageUrls(filenames[])`: Get multiple image URLs

## File Storage Structure

```
Realtraspaces_be/
├── public/
│   └── blogImages/
│       ├── blog-1234567890-123456789.jpg
│       ├── blog-1234567890-987654321.png
│       └── ...
```

## Image Naming Convention

Images are automatically named using the format:
```
blog-{timestamp}-{randomNumber}.{extension}
```

Example: `blog-1703123456789-123456789.jpg`

## Error Handling

- **Upload Errors**: Returns 400 status with error message
- **File Type Errors**: Only image files are accepted
- **Size Limit Errors**: 5MB maximum per file
- **Cleanup**: Automatically removes uploaded files if blog creation fails

## Security Features

- File type validation (only images)
- File size limits
- Unique filename generation
- Automatic cleanup of orphaned files

## Testing

Use the provided test file: `test-blog-upload.html`

1. Open the file in a browser
2. Fill in the blog details
3. Select one or more images
4. Submit the form
5. Check the response and verify images are uploaded

## Usage Examples

### Frontend: Display Blog Images
```tsx
import { getBlogImageUrls } from '@/utils/imageUtils';

const BlogImages = ({ blogImages }) => {
  const imageUrls = getBlogImageUrls(blogImages);
  
  return (
    <div className="blog-images">
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Blog image ${index + 1}`} />
      ))}
    </div>
  );
};
```

### Backend: Access Image Files
```javascript
// In your controller or service
const imagePath = path.join(__dirname, '../../public/blogImages', filename);
const imageBuffer = await fs.readFile(imagePath);
```

## Notes

- The `blogImages` field in the database stores an array of filenames
- Images are served from both static routes (`/blogImages/`) and API routes (`/api/blogs/image/`)
- Old images are automatically cleaned up when updating blogs
- The system supports both single and multiple image uploads
- All uploaded images are validated for type and size before processing
