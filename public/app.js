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
require("./utils/instrument");
const Sentry = __importStar(require("@sentry/node"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const loggers_1 = __importDefault(require("./utils/loggers"));
const config_1 = __importDefault(require("./utils/config"));
const db_1 = __importDefault(require("./config/db"));
//Import the models
require("./models");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const carListingRoutes_1 = __importDefault(require("./routes/carListingRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.default.serverPort;
const version = "v1";
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.json());
// app.use(express.urlencoded({ extended: false }));
app.get("/health", (req, res) => {
    res.send(`Welcome to Cardel ${process.env.SERVER_NAME} Service`);
});
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
//use Routes for api 
app.use('/auth', userRoutes_1.default);
app.use('/carlisting', carListingRoutes_1.default);
app.use('/upload', uploadRoutes_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
Sentry.captureException(new Error("Manual test error from Sentry"));
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    loggers_1.default.success(`API is Alive and running 🚀 on port ${port}`);
    yield db_1.default.sync({ alter: false });
}));
