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
const sequelize_1 = require("sequelize");
const loggers_1 = __importDefault(require("../utils/loggers"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure environment variables are loaded
// Validate required environment variables
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
if (!DB_NAME || !DB_USER || !DB_HOST) {
    loggers_1.default.error("Missing required database environment variables.");
    process.exit(1); // Stop the server if env variables are missing
}
// Initialize Sequelize with enhanced options
const sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: Number(DB_PORT) || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false, // Enable query logging in development
    pool: {
        max: 10, // Max connections
        min: 0, // Min connections
        acquire: 30000, // Max time (ms) to get a connection
        idle: 10000, // Max idle time (ms) before releasing a connection
    },
    retry: {
        max: 3, // Retry failed connections up to 3 times
    },
});
// Authenticate and sync database
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        loggers_1.default.success("✅ MySQL connected successfully.");
        yield sequelize.sync({ alter: true }); // Sync models with DB (use with caution in production)
    }
    catch (error) {
        loggers_1.default.error(`❌ Unable to connect to the database: ${error.message}`);
        process.exit(1); // Gracefully exit if DB connection fails
    }
}))();
exports.default = sequelize;
