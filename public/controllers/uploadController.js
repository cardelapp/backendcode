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
const models_1 = require("../models");
const Uploadupdate = (carId, urls) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carListingObject = yield models_1.CarListing.findByPk(carId);
        if (!carListingObject) {
            throw new Error(`Car listing with ID ${carId} not found`);
        }
        const combinedObject = Object.assign(Object.assign({}, carListingObject.toJSON()), { images: urls });
        yield models_1.CarListing.update(combinedObject, { where: { id: carId } });
        return { carId, urls };
    }
    catch (error) {
        console.error(`Error updating car listing: ${error.message}`);
        throw new Error(`An error occurred while updating the car listing: ${error.message}`);
    }
});
exports.default = Uploadupdate;
