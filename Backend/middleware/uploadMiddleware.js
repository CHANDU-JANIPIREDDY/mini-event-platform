const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Check if Cloudinary is configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
                     process.env.CLOUDINARY_API_KEY &&
                     process.env.CLOUDINARY_API_SECRET;

let storage, upload;

if (useCloudinary) {
  // Use Cloudinary for storage
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'event_platform',
      allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
      transformation: [
        { width: 800, height: 600, crop: 'limit' } // Limit image size
      ]
    },
  });

  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
} else {
  // Use local storage as fallback
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      cb(
        null,
        `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      );
    }
  });

  // File filter
  const fileFilter = (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|webp/i;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
  };

  upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
}

module.exports = upload;
