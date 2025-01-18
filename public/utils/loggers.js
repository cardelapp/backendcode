"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Log {
}
Log.info = (args) => console.log(chalk_1.default.blue(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk_1.default.blueBright(args) : args);
Log.success = (args) => console.log(chalk_1.default.bgBlue(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk_1.default.blueBright(args) : args);
Log.error = (args) => console.log(chalk_1.default.red(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk_1.default.redBright(args) : args);
Log.warn = (args) => console.log(chalk_1.default.yellow(`[${new Date().toDateString()}] [INFO]`), typeof args == 'string' ? chalk_1.default.yellowBright(args) : args);
exports.default = Log;
