import express, { Request, Response, NextFunction } from "express";

import { carListingController } from "../controllers/carListingController"; 
import { authenticateToken, checkDealerRole } from "../middleware";

const router = express.Router();

// Get all car listings (public)
router.get('/getAllCars', (req: Request, res: Response) => {
    carListingController.getAllCars(req, res);
});

// Create a new car listing (dealers only)
router.post(
  '/creatCarListings', 
  authenticateToken,
  checkDealerRole,
  (req: Request, res: Response) => carListingController.createCarListing(req, res)
);


export default router;