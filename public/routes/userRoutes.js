"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    (0, authController_1.getuser)(req, res);
});
router.post('/emailchecker', (req, res) => { (0, authController_1.emailChecker)(req, res); });
router.post('/changerole', authmiddleware_1.authenticateToken, (req, res, next) => { (0, authController_1.changeRole)(req, res); });
router.post('/register', (req, res) => { (0, authController_1.register)(req, res); });
router.post('/sendotp', (req, res) => { (0, authController_1.sendotp)(req, res); });
router.post('/verifyotp', (req, res, next) => { (0, authmiddleware_1.tokenpassword)(req, res, next); }, (req, res) => { (0, authController_1.verifyopt)(req, res); });
router.post('/forgotpaswword', (req, res) => { (0, authController_1.forgotPassword)(req, res); });
router.post('/changepassword', (req, res, next) => { (0, authmiddleware_1.tokenpassword)(req, res, next); }, (req, res) => { (0, authController_1.verifypassword)(req, res); });
router.post('/login', (req, res) => { (0, authController_1.login)(req, res); });
exports.default = router;
