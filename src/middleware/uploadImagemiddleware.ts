import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads/cars directory exists
export const uploadDir = 'uploads/cars';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);  // Upload directory
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const userId = req.user?.id;  // Fallback to '0' if no userId
    const carId = req.query.carId || '0';  // Get carId from query parameter, default to '0' if not found
    const ext = '.png';  // Set all files to have a '.png' extension

    // Safely check if req.files exists and find the index
    let fileIndex = 1; // Default to 1
    if (Array.isArray(req.files)) {
      // Ensure that we correctly track the index for every file in the array
      fileIndex = req.files.length ;  // The new file will have an index based on the array length
    }

    // Construct the filename: userId + carId + fileIndex
    const filename = `${userId}${carId}${fileIndex}${ext}`;
    cb(null, filename);
  }
});

// Multer upload handler for multiple files
export const uploadCarImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit per image
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
  }
}).array('carImages', 4);  // Max 4 images

// Error-handling middleware for multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    res.status(400).json({ message: `Multer Error: ${err.message}` });
  } else if (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  } else {
    next();
  }
};
