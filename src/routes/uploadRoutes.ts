import express, { Request, Response, NextFunction } from "express";
import { checkDealerRole,authenticateToken,uploadCarImages } from "../middleware";
import Uploadupdate from "../controllers/uploadController";

const router = express.Router();

// Create a new car listing (dealers only)
router.post(
  '/', 
  (req: Request, res: Response,next:NextFunction)=>{authenticateToken(req,res,next)},
  checkDealerRole, 
  uploadCarImages,
  (req: Request, res: Response) => Uploadupdate(req, res)
);


export default router;