import express, {  Router } from "express";
import { initiatePayment,verifyPayment } from "../controllers/checkoutController";
import { authenticateToken } from "../middleware/authmiddleware";

const router: Router = express.Router();

router.post('/payments/initiate', authenticateToken, initiatePayment); // Initiate payment
router.post('/payments/verify', authenticateToken,verifyPayment); // Initiate payment

export default router;