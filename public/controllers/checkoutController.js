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
exports.verifyPayment = exports.initiatePayment = void 0;
const models_1 = require("../models");
const axios_1 = __importDefault(require("axios"));
const initiatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { carListingId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ✅ Safely access user ID
        if (!carListingId) {
            res.status(400).json({ message: "Car Listing ID is required." });
            return;
        }
        if (!userId) {
            res.status(401).json({ message: "Unauthorized user." });
            return;
        }
        // ✅ Validate Car Listing
        const carObject = yield models_1.CarListing.findByPk(carListingId);
        if (!carObject) {
            res.status(404).json({ message: "Car does not exist." });
            return;
        }
        // ✅ Validate User
        const user = yield models_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const email = user.email;
        const totalAmount = carObject.price;
        // Initiate payment with Paystack API
        const paystackResponseInit = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", {
            email: email,
            amount: totalAmount * 100, // Paystack expects the amount in kobo (100 kobo = 1 naira)
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        const { authorization_url, reference } = paystackResponseInit.data.data;
        // Respond with the payment URL and reference
        res.status(200).json({ authorization_url, reference, carListingId });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to initiate payment.", error: error.message });
    }
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { reference, carListingId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!reference) {
            res.status(400).json({ message: "Payment reference is required." });
            return;
        }
        if (!carListingId) {
            res.status(400).json({ message: "Car Listing ID is required." });
            return;
        }
        if (!userId) {
            res.status(401).json({ message: "Unauthorized user." });
            return;
        }
        const user = yield models_1.User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const carObject = yield models_1.CarListing.findByPk(carListingId);
        if (!carObject) {
            res.status(404).json({ message: "Car does not exist." });
            return;
        }
        const email = user.email;
        // Verify payment with Paystack API
        const paystackResponse = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        const { data } = paystackResponse.data;
        if (data.status === "success") {
            // Save payment reference in the order
            const status = "success";
            const order = yield models_1.Order.create({
                carListingId,
                userId,
                email,
                status,
                paymentRef: reference,
            });
            res.status(200).json({ message: "Payment verified successfully.", order });
        }
        else {
            const status = "failed";
            const order = yield models_1.Order.create({
                carListingId,
                userId,
                email,
                status,
                paymentRef: reference,
            });
            res.status(400).json({ message: "Payment verification failed." });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Failed to verify payment.", error: error.message });
    }
});
exports.verifyPayment = verifyPayment;
