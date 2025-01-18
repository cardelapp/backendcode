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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailPassword = void 0;
const emailConfig_1 = require("./emailConfig");
const sendEmailPassword = (to_1, ...args_1) => __awaiter(void 0, [to_1, ...args_1], void 0, function* (to, subject = '', email = '', htmltemplate // Correct typing for the htmltemplate function
) {
    try {
        const htmlContent = htmltemplate('123'); // Example: Pass a value to generate the HTML content
        const mailOptions = {
            from: 'miresumiresume@gmail.com',
            to: email,
            subject: subject,
            html: htmlContent,
        };
        const info = yield emailConfig_1.transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, message: 'Email sent successfully.' };
    }
    catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Error sending email.' };
    }
});
exports.sendEmailPassword = sendEmailPassword;
