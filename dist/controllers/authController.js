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
exports.verifypassword = exports.forgotPassword = exports.updateuser = exports.selectuserid = exports.verifyopt = exports.sendotp = exports.changeRole = exports.login = exports.emailChecker = exports.register = exports.getuser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../utils/sendEmail");
const crypto_1 = __importDefault(require("crypto"));
const emailtemplate_1 = require("../utils/emailtemplate");
const loggers_1 = __importDefault(require("../utils/loggers"));
const getuser = (req, res) => {
    return res.status(201).json({ message: 'hello' });
};
exports.getuser = getuser;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, email, gender, address, password, phonenumber } = req.body;
        console.log(req.body);
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        // Validate password (e.g., minimum length, includes letters and numbers)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and include both letters and numbers.",
            });
        }
        if (!phonenumber) {
            return res.status(400).json({
                message: "Phone number Field empty",
            });
        }
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Proceed with registration logic (e.g., create a new user in the database)
        const newUser = yield userModel_1.default.create({ firstname, lastname, email, gender, address, phonenumber, password: hashedPassword });
        // Return success response
        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
            },
        });
    }
    catch (error) {
        console.error("Error during registration:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.register = register;
const emailChecker = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        // Check if the user already exists
        const existingUser = yield userModel_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }
        // Return success response
        return res.status(201).json({
            message: "New User.",
        });
    }
    catch (error) {
        console.error("Error during registration:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.emailChecker = emailChecker;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        // Check if the user exists
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Compare passwords
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        loggers_1.default.info(user.id);
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
        { expiresIn: "1h" });
        // Respond with user details and token
        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                token,
            },
        });
    }
    catch (error) {
        console.error("Error during login:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.login = login;
const changeRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is missing." });
        }
        const user = yield userModel_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const currentRole = user.role;
        let newRole;
        if (currentRole === "user") {
            newRole = "dealer";
        }
        else if (currentRole === "dealer") {
            newRole = "user";
        }
        else {
            return res.status(400).json({ message: "Invalid role." });
        }
        yield userModel_1.default.update({ role: newRole }, { where: { id: userId } });
        return res.status(200).json({
            message: `Role updated successfully to ${newRole}.`,
            updatedRole: newRole,
        });
    }
    catch (error) {
        console.error("Error changing role:", error);
        return res.status(500).json({
            message: "An error occurred while updating the role.",
            error: error.message,
        });
    }
});
exports.changeRole = changeRole;
const sendotp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Validate email
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        // Generate a 6-digit OTP
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        // Generate a JWT token containing the OTP and email
        const token = jsonwebtoken_1.default.sign({ otp, email: email }, process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
        { expiresIn: "5m" });
        // Email Subject and HTML Template
        const subject = "Password Reset Request";
        const htmltemplate = (0, emailtemplate_1.VerifyTemplate)(otp);
        // Send the email
        const emailResult = yield (0, sendEmail_1.sendEmailPassword)(email, subject, email, () => htmltemplate);
        if (!emailResult.success) {
            return res.status(500).json({ message: "Failed to send email." });
        }
        // Return success response
        return res.status(200).json({ message: "OTP sent to your email.", token });
    }
    catch (error) {
        console.error("Error in forgotPassword:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.sendotp = sendotp;
const verifyopt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const otpjwt = (_a = req.otpuser) === null || _a === void 0 ? void 0 : _a.otp;
        const emailjwt = (_b = req.otpuser) === null || _b === void 0 ? void 0 : _b.email;
        const otp = req.body.otp;
        const email = req.body.email;
        console.log(emailjwt, otpjwt);
        if (otpjwt !== otp || email !== emailjwt) {
            return res.status(404).json({ message: "Invalid otp." });
        }
        return res.status(200).json({ message: "Email verify successfully." });
    }
    catch (error) {
        console.error("Error in forgotPassword:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.verifyopt = verifyopt;
const selectuserid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        // Retrieve user details
        const user = yield userModel_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        user.password = "";
        // Respond with user details
        return res.status(200).json({
            message: "User retrieved successfully.", user
        });
    }
    catch (error) {
        console.error("Error retrieving user:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.selectuserid = selectuserid;
const updateuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Get user ID from the token (middleware should set this)
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        // Validate incoming data (you can use libraries like Joi or express-validator)
        const { firstname, lastname, gender, state, lga, address, directoridnumber, directordob, directoraddress, directorfirstname, directorlastname, phonenumber, directorstate, directorlga, idtype, businessname, businesscategory, tinnumber, bnnumber, files } = req.body;
        if (!firstname || !lastname) {
            return res.status(400).json({ message: "First name, last name, and email are required." });
        }
        // Find the user in the database
        const user = yield userModel_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Update the user's data
        user.firstname = firstname;
        user.lastname = lastname;
        user.gender = gender || user.gender;
        user.address = address || user.address;
        user.phonenumber = phonenumber || user.phonenumber;
        // Save the updated user to the database
        yield user.save();
        // Respond with the updated user details
        return res.status(200).json({
            message: "User updated successfully.",
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                address: user.address,
                phonenumber: user.phonenumber,
            },
        });
    }
    catch (error) {
        console.error("Error updating user:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.updateuser = updateuser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        // Validate email
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }
        // Check if the user exists
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }
        // Generate a 6-digit OTP
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        // Generate a JWT token containing the OTP and email
        const token = jsonwebtoken_1.default.sign({ otp, email: user.email }, process.env.JWT_SECRET || "default_secret", // Use a secure secret in production
        { expiresIn: "5m" });
        // Email Subject and HTML Template
        const subject = "Password Reset Request";
        const htmltemplate = (0, emailtemplate_1.VerifyTemplate)(otp);
        // Send the email
        const emailResult = yield (0, sendEmail_1.sendEmailPassword)(email, subject, email, () => htmltemplate);
        if (!emailResult.success) {
            return res.status(500).json({ message: "Failed to send email." });
        }
        // Return success response
        return res.status(200).json({ message: "OTP sent to your email.", token });
    }
    catch (error) {
        console.error("Error in forgotPassword:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.forgotPassword = forgotPassword;
const verifypassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const newpassword = req.body.password;
        const user = yield userModel_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newpassword, 10);
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: "Password updated successfully." });
    }
    catch (error) {
        console.error("Error in forgotPassword:", error.message || error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.verifypassword = verifypassword;
