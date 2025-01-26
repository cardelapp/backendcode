import express, { Request, Response, NextFunction } from "express";
import { checkDealerRole,authenticateToken,uploadCarImages, handleUploadToSupabase, handleUploadError } from "../middleware";
import Uploadupdate from "../controllers/uploadController";

const router = express.Router();

// Create a new car listing (dealers only)
router.post(
  '/', 
  authenticateToken,
  checkDealerRole, 
  uploadCarImages,
  handleUploadToSupabase,
  handleUploadError,
);


export default router;