"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usermiddleware_1 = require("../middleware/usermiddleware");
const carListingController_1 = require("../controllers/carListingController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
// Get all car listings (public)
router.get('/getAllCars', (req, res) => {
    carListingController_1.carListingController.getAllCars(req, res);
});
// search car listings (public)
router.get('/searchCars', (req, res) => {
    carListingController_1.carListingController.searchCars(req, res);
});
// Create a new car listing (dealers only)
router.post('/creatCarListings', middleware_1.authenticateToken, usermiddleware_1.checkDealerRole, (req, res) => carListingController_1.carListingController.createCarListing(req, res));
router.post('/editCarListing/:carId', middleware_1.authenticateToken, usermiddleware_1.checkDealerRole, (req, res) => carListingController_1.carListingController.editCarListing(req, res));
router.post('/deleteCarListing/:carId', middleware_1.authenticateToken, usermiddleware_1.checkDealerRole, (req, res) => carListingController_1.carListingController.deleteCarListing(req, res));
exports.default = router;
