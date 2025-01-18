"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.uploadCarImages = exports.uploadDir = void 0;
const multer_1 = __importStar(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure the uploads/cars directory exists
exports.uploadDir = 'uploads/cars';
if (!fs_1.default.existsSync(exports.uploadDir)) {
    fs_1.default.mkdirSync(exports.uploadDir, { recursive: true });
}
// Configure storage for multer
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, exports.uploadDir); // Upload directory
    },
    filename: (req, file, cb) => {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Fallback to '0' if no userId
        const carId = req.query.carId || '0'; // Get carId from query parameter, default to '0' if not found
        const ext = '.png'; // Set all files to have a '.png' extension
        // Safely check if req.files exists and find the index
        let fileIndex = 1; // Default to 1
        if (Array.isArray(req.files)) {
            // Ensure that we correctly track the index for every file in the array
            fileIndex = req.files.length; // The new file will have an index based on the array length
        }
        // Construct the filename: userId + carId + fileIndex
        const filename = `${userId}${carId}${fileIndex}${ext}`;
        cb(null, filename);
    }
});
// Multer upload handler for multiple files
exports.uploadCarImages = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per image
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extName = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
        }
    }
}).array('carImages', 4); // Max 4 images
// Error-handling middleware for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.MulterError) {
        res.status(400).json({ message: `Multer Error: ${err.message}` });
    }
    else if (err) {
        res.status(400).json({ message: `Error: ${err.message}` });
    }
    else {
        next();
    }
};
exports.handleUploadError = handleUploadError;
