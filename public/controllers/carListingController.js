"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.carListingController = exports.CarListingController = void 0;
const utilFunctionController_1 = __importDefault(require("./utilFunctionController"));
const models_1 = require("../models");
class CarListingController {
    constructor() {
        this.crudUtil = new utilFunctionController_1.default(models_1.CarListing); // Instantiate with the CarListing model
    }
    // Create a new car listing using
    createCarListing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const dealerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming user information is available in req.user
                console.log(dealerId);
                const payload = Object.assign(Object.assign({}, req.body), { dealerId }); // Merging req.body with dealerId
                const carListing = yield models_1.CarListing.create(payload); // Using the payload to create the car listing
                res.status(201).json(carListing); // Return the created car listing
            }
            catch (error) {
                res.status(500).json({ message: 'Error creating car listing', error });
            }
        });
    }
    //Edit an existing car listing using GenericCRUDUtil
    editCarListing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.user.id;
                const carListing = yield models_1.CarListing.findByPk(id);
                if (!carListing) {
                    return res.status(404).json({ success: false, message: "Car listing not found" });
                }
                // Use the updateById method from GenericCRUDUtil
                const carUpdate = this.crudUtil.updateById(req, res);
                res.status(201).json(carUpdate);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    // Delete a car listing using GenericCRUDUtil
    deleteCarListing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const carListing = yield models_1.CarListing.findByPk(id);
                if (!carListing) {
                    return res.status(404).json({ success: false, message: "Car listing not found" });
                }
                // Use the deleteById method from GenericCRUDUtil
                return this.crudUtil.deleteById(req, res);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    // Get all cars with pagination using GenericCRUDUtil
    getAllCars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Use the getAll method from GenericCRUDUtil
                return this.crudUtil.getAll(req, res);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
    // Get cars by search input with pagination using GenericCRUDUtil
    searchCars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.crudUtil.getAll(req, res);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.CarListingController = CarListingController;
exports.carListingController = new CarListingController();
//export default carListingController;
