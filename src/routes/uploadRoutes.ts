// src/routes/carRoutes.ts

import express from 'express';
import { checkDealerRole,uploadCarImages,handleUploadError,authenticateToken } from '../middleware';
import Uploadupdate from '../controllers/uploadController';
const router = express.Router();

// Protected route with authMiddleware
router.post(
  '/upload-car-images',
  authenticateToken,   // 🔒 Authentication check
   checkDealerRole,      
  uploadCarImages,        // 📤 Multer file upload
  handleUploadError,      // ❗ Error handling
  Uploadupdate
);

export default router;
