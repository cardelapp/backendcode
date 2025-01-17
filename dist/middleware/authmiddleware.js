"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenpassword = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access token missing or invalid." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
        req.user = { id: decoded.id, email: decoded.email };
        next();
    }
    catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};
exports.authenticateToken = authenticateToken;
const tokenpassword = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access token missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
        req.otpuser = { otp: decoded.otp, email: decoded.email }; // Attach user info to request
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};
exports.tokenpassword = tokenpassword;
