import express, { Request, Response, NextFunction } from "express";
import { checkDealerRole } from "../middleware/usermiddleware"; 
import { carListingController } from "../controllers/carListingController"; 
import { authenticateToken } from "../middleware";

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

router.post('/editCarListing/:carId',
  authenticateToken,
  checkDealerRole,
  (req: Request<{ carId }>, res: Response) => carListingController.editCarListing(req, res)
)

router.post('/deleteCarListing/:carId',
  authenticateToken,
  checkDealerRole,
  (req: Request<{ carId }>, res: Response) => carListingController.deleteCarListing(req, res)
)


export default router;