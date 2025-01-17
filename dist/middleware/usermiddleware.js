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
exports.checkDealerRole = exports.checkUserExists = void 0;
const models_1 = require("../models");
// middleware/checkUserExists.ts
const checkUserExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const user = yield models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Attach the user object to the request for further use
        ;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking user', error });
    }
});
exports.checkUserExists = checkUserExists;
// middleware/checkDealerRole.ts
const checkDealerRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = yield models_1.User.findByPk(req.user.id); // Assuming `req.user` contains user ID
        if (!userObj) {
            res.status(400).json({ message: 'User data is not available' });
            return; // Explicitly end the middleware chain
        }
        if (userObj.role !== 'dealer') {
            res.status(403).json({ message: 'Access denied: User is not a dealer' });
            return;
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkDealerRole = checkDealerRole;
