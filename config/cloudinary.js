import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 1. Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'expat-visas', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file types
    },
});

// 3. Initialize Multer upload middleware
const upload = multer({ storage });

export default upload;