import express, { Request, Response, NextFunction } from "express";
import { checkDealerRole } from "../middleware/usermiddleware"; 
import { carListingController } from "../controllers/carListingController"; 

const router = express.Router();

// Get all car listings (public)
router.get('/getAllCars', (req: Request, res: Response) => {
    carListingController.getAllCars(req, res);
});

// Create a new car listing (dealers only)
router.post(
  '/creatCarListings', 
  checkDealerRole, 
  (req: Request, res: Response) => carListingController.createCarListing(req, res)
);


export default router;