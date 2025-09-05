const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded CV files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/resume');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created resume upload directory:', uploadDir);
    }
    
    console.log('Saving CV file to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'cv-' + uniqueSuffix + ext);
  }
});

// File filter to allow PDFs and images
const fileFilter = (req, file, cb) => {
  // Allow PDF files
  const allowedPdfTypes = ['application/pdf'];
  
  // Allow image files
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  
  // Combine all allowed types
  const allowedTypes = [...allowedPdfTypes, ...allowedImageTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, JPG, GIF, and WebP files are allowed.'), false);
  }
};

// Initialize multer with configuration for single CV file
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (larger for PDFs)
    files: 1 // Only allow one file per request
  }
});

module.exports = {
  uploadSingle
};
