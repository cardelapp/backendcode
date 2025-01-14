import express, { NextFunction, Request, Response, Router } from "express";
import { initiatePayment } from "../controllers/checkoutController";
import { authenticateToken } from "../middleware/authmiddleware";

const router: Router = express.Router();

router.post('/payments/initiate', authenticateToken, initiatePayment); // Initiate payment

export default router;