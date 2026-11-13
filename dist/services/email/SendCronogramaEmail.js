"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCronogramaEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
class SendCronogramaEmail {
    async execute(email, file) {
        const pdfBuffer = fs_1.default.readFileSync(file.path);
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.sendMail({
            from: '"Sistema" <noreply@sistema.com>',
            to: email,
            subject: `Cronograma`,
            text: "Segue o cronograma em anexo.",
            attachments: [
                {
                    filename: file.originalname,
                    content: pdfBuffer,
                },
            ],
        });
    }
}
exports.SendCronogramaEmail = SendCronogramaEmail;
