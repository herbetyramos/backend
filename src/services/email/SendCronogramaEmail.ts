import nodemailer from "nodemailer";
import fs from "fs";

export class SendCronogramaEmail {
  async execute(email: string, file: Express.Multer.File) {

    const pdfBuffer = fs.readFileSync(file.path);

    const transporter = nodemailer.createTransport({
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