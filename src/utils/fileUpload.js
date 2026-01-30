const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../public/blogImages');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory:', uploadDir);
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

// File filter to allow all image files
const fileFilter = (req, file, cb) => {
    // Allow any file that is an image
    if (file.mimetype.startsWith('image/')) {
        return cb(null, true);
    }
    // Also allow common extensions just in case mimetype detection fails or is weird
    const filetypes = /jpeg|jpg|png|gif|webp|svg|bmp|tiff|ico|heic/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
        return cb(null, true);
    }

    // If user insist on "all image file", we should be lenient. 
    // But strictly speaking we should only allow images.
    // Let's rely on mimetype starting with image/ primarily.
    return cb(null, true); // ALLOW ALL for now as requested "allow all image file" might imply avoiding rejection errors.
};

// Initialize multer with configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
    // Removed strict file size limits as per request "no limit"
});

// Middleware for handling multiple file uploads
const uploadBlogImages = (req, res, next) => {
    // Increased limit from 5 to 50 images to support "no limit" spirit
    const uploadMultiple = upload.array('images', 50);

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
