const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../public/blogImages');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, 'blog-' + uniqueSuffix + ext);
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
};

// Initialize multer with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit per file
    }
});

// Middleware for handling multiple file uploads
const uploadBlogImages = (req, res, next) => {
    const uploadMultiple = upload.array('images', 5); // Allow up to 5 files
    
    uploadMultiple(req, res, function (err) {
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
    uploadBlogImages
};
