"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Config = {
    sentryDSN: process.env.SENTRY_DSN,
    serverName: process.env.SERVER_NAME,
    serverPort: Number(process.env.PORT) || 3000, // Ensure it's a number and provide a default
    environment: process.env.SERVER_ENVIRONMENT,
    providusCardURL: process.env.PROVIDUS_CARD_BASE_URL,
    providusApiVersionURL: process.env.PROVIDUS_CARD_API_VERSION,
};
exports.default = Config;
