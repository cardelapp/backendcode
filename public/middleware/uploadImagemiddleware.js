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
exports.handleUploadError = exports.handleUploadToSupabase = exports.uploadCarImages = void 0;
const multer_1 = __importStar(require("multer"));
const supabase_js_1 = require("@supabase/supabase-js");
const uploadController_1 = __importDefault(require("../controllers/uploadController"));
// Supabase Configuration
const supabaseUrl = process.env.SUPERBASE_URL; // Replace with your Supabase URL
const supabaseAnonKey = process.env.SUPERBASE_KEY; // Replace with your Supabase Anon Key
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Configure multer (in-memory storage)
const storage = multer_1.default.memoryStorage();
exports.uploadCarImages = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per image
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extName = allowedTypes.test(file.originalname.toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
        }
    },
}).array('carImages', 4); // Max 4 images
// Upload images to Supabase Storage and update the database
const handleUploadToSupabase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ message: 'No files uploaded' });
            return;
        }
        // Ensure carId is provided
        const carId = req.query.carId;
        if (!carId) {
            res.status(400).json({ message: 'Car ID is required' });
            return;
        }
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || '0'; // Fallback user ID
        const bucketName = 'myupload'; // Supabase bucket name
        const uploadedFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `${userId}_${carId}_${Date.now()}_${i}.png`; // Unique file name
            // Upload to Supabase Storage
            const { data, error } = yield supabase.storage
                .from(bucketName)
                .upload(fileName, file.buffer, { contentType: file.mimetype });
            if (error) {
                throw new Error(`Error uploading file ${file.originalname}: ${error.message}`);
            }
            // Generate public URL
            const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
            if (publicUrlData === null || publicUrlData === void 0 ? void 0 : publicUrlData.publicUrl) {
                uploadedFiles.push(publicUrlData.publicUrl);
            }
        }
        // Update database with uploaded image URLs
        try {
            const result = yield (0, uploadController_1.default)(Number(carId), uploadedFiles);
            res.status(200).json({
                message: 'Files uploaded and database updated successfully',
                uploadedFiles,
                dbResult: result,
            });
        }
        catch (dbError) {
            res.status(500).json({
                message: 'Files uploaded but failed to update the database',
                error: dbError.message,
            });
        }
    }
    catch (err) {
        next(err); // Pass errors to the error-handling middleware
    }
});
exports.handleUploadToSupabase = handleUploadToSupabase;
// Error-handling middleware
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
