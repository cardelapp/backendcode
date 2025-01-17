import express, { NextFunction, Request, Response, Router } from "express";
import { initiatePayment } from "../controllers/checkoutController";
import { authenticateToken } from "../middleware/authmiddleware";

const router: Router = express.Router();

router.post('/payments/initiate', (req: Request, res: Response,next:NextFunction)=>{authenticateToken(req,res,next)}, initiatePayment); // Initiate payment

export default router;