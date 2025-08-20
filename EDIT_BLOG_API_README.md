# Edit Blog API Documentation

## Overview
The Edit Blog API allows you to update existing blog posts with new content, images, and metadata. The API supports both full and partial updates, with automatic image management and slug generation.

## API Endpoint
```
PUT /api/blogs/:id
```

## Features
- ✅ **Full Blog Updates**: Update all blog fields at once
- ✅ **Partial Updates**: Update only specific fields
- ✅ **Image Upload**: Upload new images (up to 5 files)
- ✅ **Image Management**: Automatic cleanup of old images
- ✅ **Slug Generation**: Auto-update slug when title changes
- ✅ **Dynamic Fields**: Support for custom dynamic fields
- ✅ **Error Handling**: Comprehensive error handling with cleanup
- ✅ **File Validation**: Image file type and size validation

## Request Format

### Headers
```
Content-Type: multipart/form-data
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `blogTitle` | string | No | Blog title (auto-generates slug if changed) |
| `blogDescription` | string | No | Blog description |
| `blogContent` | string | No | Main blog content |
| `writer` | string | No | Author name |
| `category` | string | No | Blog category |
| `tags` | JSON string | No | Array of tags (e.g., `["tag1", "tag2"]`) |
| `images` | file[] | No | Image files (up to 5, max 5MB each) |
| `dynamicFields` | JSON string | No | Custom dynamic fields |
| `fieldSchema` | JSON string | No | Schema for dynamic fields |

## Response Format

### Success Response (200)
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "blogTitle": "Updated Blog Title",
    "blogDescription": "Updated description",
    "blogContent": "Updated content",
    "blogImages": ["blog-1234567890-123456789.jpg"],
    "writer": "Updated Writer",
    "category": "Updated Category",
    "tags": ["tag1", "tag2"],
    "slug": "updated-blog-title",
    "likes": 0,
    "bookmarks": 0,
    "dynamicFields": {},
    "fieldSchema": {},
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

### Error Response (400/404/500)
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Usage Examples

### 1. Update Blog Title Only
```javascript
const formData = new FormData();
formData.append('blogTitle', 'New Blog Title');

const response = await fetch('/api/blogs/1', {
  method: 'PUT',
  body: formData
});
```

### 2. Update Multiple Fields
```javascript
const formData = new FormData();
formData.append('blogTitle', 'Updated Title');
formData.append('blogDescription', 'Updated description');
formData.append('blogContent', 'Updated content');
formData.append('writer', 'New Author');
formData.append('category', 'New Category');
formData.append('tags', JSON.stringify(['new', 'tags']));

const response = await fetch('/api/blogs/1', {
  method: 'PUT',
  body: formData
});
```

### 3. Update with Images
```javascript
const formData = new FormData();
formData.append('blogTitle', 'Blog with Images');
formData.append('blogDescription', 'Updated with new images');

// Add image files
const imageFiles = document.getElementById('images').files;
for (let i = 0; i < imageFiles.length; i++) {
  formData.append('images', imageFiles[i]);
}

const response = await fetch('/api/blogs/1', {
  method: 'PUT',
  body: formData
});
```

### 4. Update with Dynamic Fields
```javascript
const formData = new FormData();
formData.append('blogTitle', 'Blog with Custom Fields');
formData.append('dynamicFields', JSON.stringify({
  customField1: 'value1',
  customField2: 'value2'
}));
formData.append('fieldSchema', JSON.stringify({
  customField1: { type: 'string' },
  customField2: { type: 'number' }
}));

const response = await fetch('/api/blogs/1', {
  method: 'PUT',
  body: formData
});
```

## Frontend Integration

### React/Next.js Example
```javascript
import { useState } from 'react';

const EditBlogForm = ({ blogId, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'tags') {
            data.append(key, JSON.stringify(formData[key]));
          } else {
            data.append(key, formData[key]);
          }
        }
      });

      // Add images
      images.forEach(image => {
        data.append('images', image);
      });

      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        body: data
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Blog updated successfully!');
        // Handle success (redirect, update state, etc.)
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      alert('Error updating blog: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.blogTitle || ''}
        onChange={(e) => setFormData({...formData, blogTitle: e.target.value})}
        placeholder="Blog Title"
      />
      <textarea
        value={formData.blogContent || ''}
        onChange={(e) => setFormData({...formData, blogContent: e.target.value})}
        placeholder="Blog Content"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files))}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Blog'}
      </button>
    </form>
  );
};
```

## Testing

### Using the Test HTML File
1. Open `test-edit-blog-api.html` in your browser
2. Enter a blog ID to edit
3. Click "Get Blog" to load existing data
4. Modify the fields as needed
5. Click "Update Blog" to save changes

### Using the Node.js Test Script
```bash
# Install dependencies (if not already installed)
npm install form-data

# Run the test script
node test-edit-blog.js
```

## Error Handling

### Common Error Scenarios
1. **Blog Not Found (404)**: The specified blog ID doesn't exist
2. **Invalid File Type (400)**: Uploaded file is not an image
3. **File Too Large (400)**: Image exceeds 5MB limit
4. **Database Error (500)**: Server-side database issues
5. **Validation Error (400)**: Invalid data format

### Error Response Examples
```json
{
  "status": "error",
  "message": "Blog not found"
}
```

```json
{
  "status": "error", 
  "message": "Only image files are allowed (jpeg, jpg, png, gif)"
}
```

## File Management

### Image Storage
- Images are stored in `public/blogImages/` directory
- File naming: `blog-{timestamp}-{random}.{extension}`
- Old images are automatically deleted when new ones are uploaded

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)

### File Size Limits
- Maximum file size: 5MB per image
- Maximum files per request: 5 images

## Security Considerations

1. **File Validation**: Only image files are accepted
2. **File Size Limits**: Prevents large file uploads
3. **File Type Checking**: Validates both extension and MIME type
4. **Automatic Cleanup**: Removes old files to prevent storage bloat
5. **Error Handling**: Graceful handling of upload failures

## Performance Notes

1. **Partial Updates**: Only specified fields are updated
2. **Image Optimization**: Consider implementing image compression
3. **Database Efficiency**: Uses Sequelize's efficient update methods
4. **File Cleanup**: Automatic cleanup prevents storage issues

## Related APIs

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get specific blog
- `POST /api/blogs` - Create new blog
- `DELETE /api/blogs/:id` - Delete blog
- `GET /api/blogs/slug/:slug` - Get blog by slug
