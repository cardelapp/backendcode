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
require("./utils/instrument");
const Sentry = __importStar(require("@sentry/node"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const loggers_1 = __importDefault(require("./utils/loggers"));
const config_1 = __importDefault(require("./utils/config"));
const db_1 = __importDefault(require("./config/db"));
// import authRoute from './routes/userRoutes';
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.default.serverPort;
const version = "v1";
const corsOptions = {
    origin: ["https://happychild-topaz.vercel.app", "https://appychild.uk", "http://localhost:3000", "http://172.20.10.6:3000"],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/health", (req, res) => {
    res.send(`Welcome to Cardel ${process.env.SERVER_NAME} Service`);
});
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
//use Routes for api 
// app.use('/auth',authRoute)
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
Sentry.captureException(new Error("Manual test error from Sentry"));
// but before any and other error-handling middlewares are defined
Sentry.setupExpressErrorHandler(app);
app.listen(port, async () => {
    loggers_1.default.success(`API is Alive and running 🚀 on port ${port}`);
    await db_1.default.sync({ alter: true });
});
