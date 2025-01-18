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
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const models_1 = require("../models");
const Uploadupdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { carId } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Fallback to undefined if no userId
        // Check if carId is provided
        if (!carId) {
            res.status(400).json({ message: 'Car ID is required' });
            return;
        }
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}/`;
        const imagePath = baseUrl + middleware_1.uploadDir;
        // Generate the image paths (assuming you have 4 images)
        let images = [];
        for (let i = 0; i < 4; i++) {
            images.push(imagePath + '/' + userId + carId + (i + 1) + '.png');
        }
        // Fetch the car listing from the database
        const carListingObject = yield models_1.CarListing.findByPk(Number(carId));
        // Check if car listing is found
        if (!carListingObject) {
            res.status(404).json({ message: `Car listing with ID ${carId} not found` });
            return;
        }
        console.log(images);
        // Combine the car listing object with the images array
        const combinedObject = Object.assign(Object.assign({}, carListingObject.toJSON()), { images });
        // Update the car listing in the database
        yield models_1.CarListing.update(combinedObject, { where: { id: carId } });
        // Return success message
        res.status(200).json({
            message: 'Images uploaded successfully',
            carListing: combinedObject,
        });
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the car listing', error: error.message });
    }
});
exports.default = Uploadupdate;
