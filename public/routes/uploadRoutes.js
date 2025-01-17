"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
const router = express_1.default.Router();
// Create a new car listing (dealers only)
router.post('/', middleware_1.authenticateToken, middleware_1.checkDealerRole, middleware_1.uploadCarImages, (req, res) => (0, uploadController_1.default)(req, res));
exports.default = router;
