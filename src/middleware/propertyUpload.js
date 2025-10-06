const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded property images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/propertyImages');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created propertyImages upload directory:', uploadDir);
    }
    
    console.log('Saving property image to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'property-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG, GIF, and WebP are allowed.'), false);
  }
};

// Initialize multer with configuration for multiple files (property images)
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Allow up to 10 files per request
  }
});

// Middleware for handling multiple property image uploads
const uploadPropertyImages = (req, res, next) => {
  const uploadMultipleFiles = uploadMultiple.array('images', 10); // Allow up to 10 files
  
  uploadMultipleFiles(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ success: false, message: err.message });
    }
    
    // If no files were uploaded, continue with empty array
    if (!req.files || req.files.length === 0) {
      req.files = [];
    }
    
    next();
  });
};

module.exports = {
  uploadPropertyImages
};
