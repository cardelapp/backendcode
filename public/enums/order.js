"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Completed"] = "Compeleted";
    OrderStatus["Confirmed"] = "Confirmed"; //To be updated by the user when item is received
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
