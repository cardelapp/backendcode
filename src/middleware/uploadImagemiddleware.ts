import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback, MulterError } from 'multer';
import { createClient } from '@supabase/supabase-js';
import Uploadupdate from '../controllers/uploadController';

// Supabase Configuration
const supabaseUrl = process.env.SUPERBASE_URL; // Replace with your Supabase URL
const supabaseAnonKey = process.env.SUPERBASE_KEY; // Replace with your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configure multer (in-memory storage)
const storage = multer.memoryStorage();

export const uploadCarImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per image
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(file.originalname.toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
    }
  },
}).array('carImages', 4); // Max 4 images

// Upload images to Supabase Storage and update the database
export const handleUploadToSupabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No files uploaded' });
      return 
    }

    // Ensure carId is provided
    const carId = req.query.carId;
    if (!carId) {
      res.status(400).json({ message: 'Car ID is required' });
      return 
    }

    const userId = req.user?.id || '0'; // Fallback user ID
    const bucketName = 'myupload'; // Supabase bucket name
    const uploadedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${userId}_${carId}_${Date.now()}_${i}.png`; // Unique file name

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) {
        throw new Error(`Error uploading file ${file.originalname}: ${error.message}`);
      }

      // Generate public URL
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      if (publicUrlData?.publicUrl) {
        uploadedFiles.push(publicUrlData.publicUrl);
      }
    }

    // Update database with uploaded image URLs
    try {
      const result = await Uploadupdate(Number(carId), uploadedFiles);
      res.status(200).json({
        message: 'Files uploaded and database updated successfully',
        uploadedFiles,
        dbResult: result,
      });
    } catch (dbError: any) {
      res.status(500).json({
        message: 'Files uploaded but failed to update the database',
        error: dbError.message,
      });
    }
  } catch (err) {
    next(err); // Pass errors to the error-handling middleware
  }
};


// Error-handling middleware
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MulterError) {
    res.status(400).json({ message: `Multer Error: ${err.message}` });
  } else if (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  } else {
    next();
  }
};