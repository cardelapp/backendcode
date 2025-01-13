"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const loggers_1 = __importDefault(require("../utils/loggers"));
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});
(async () => {
    try {
        await sequelize.authenticate();
        loggers_1.default.success("MySQL connected successfully.");
    }
    catch (error) {
        loggers_1.default.error(`Unable to connect to the database:${error.message}`);
    }
})();
exports.default = sequelize;
