"use strict";
// carEnums.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.FuelType = exports.Condition = exports.BodyStyle = exports.Transmission = void 0;
var Transmission;
(function (Transmission) {
    Transmission["Manual"] = "Manual";
    Transmission["Automatic"] = "Automatic";
    Transmission["SemiAutomatic"] = "Semi-Automatic";
    Transmission["CVT"] = "CVT";
})(Transmission || (exports.Transmission = Transmission = {}));
var BodyStyle;
(function (BodyStyle) {
    BodyStyle["Convertible"] = "Convertible";
    BodyStyle["NonConvertible"] = "NonConvertible";
    BodyStyle["Sedan"] = "Sedan";
    BodyStyle["Hatchback"] = "Hatchback";
    BodyStyle["SUV"] = "SUV";
    BodyStyle["Truck"] = "Truck";
})(BodyStyle || (exports.BodyStyle = BodyStyle = {}));
var Condition;
(function (Condition) {
    Condition["New"] = "New";
    Condition["Used"] = "Used";
})(Condition || (exports.Condition = Condition = {}));
var FuelType;
(function (FuelType) {
    FuelType["Petrol"] = "Petrol";
    FuelType["Diesel"] = "Diesel";
    FuelType["Electric"] = "Electric";
    FuelType["Hybrid"] = "Hybrid";
})(FuelType || (exports.FuelType = FuelType = {}));
var Status;
(function (Status) {
    Status["Available"] = "Available";
    Status["Sold"] = "Sold";
    Status["Inactive"] = "Inactive";
})(Status || (exports.Status = Status = {}));
