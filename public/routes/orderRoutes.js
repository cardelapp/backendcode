"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkoutController_1 = require("../controllers/checkoutController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.post('/payments/initiate', authmiddleware_1.authenticateToken, checkoutController_1.initiatePayment); // Initiate payment
exports.default = router;
