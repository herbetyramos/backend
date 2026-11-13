"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCronogramaController = void 0;
const SendCronogramaEmail_1 = require("../../services/email/SendCronogramaEmail");
class SendCronogramaController {
    async handle(req, res) {
        const { email } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "Nenhum arquivo PDF enviado." });
        }
        try {
            const service = new SendCronogramaEmail_1.SendCronogramaEmail();
            await service.execute(email, file);
            return res.json({ message: "Email enviado com sucesso!" });
        }
        catch (error) {
            console.error("Erro ao enviar email:", error);
            return res.status(500).json({ error: "Erro ao enviar email." });
            console.log("USER:", process.env.EMAIL_USER);
            console.log("PASS:", process.env.EMAIL_PASS);
        }
    }
}
exports.SendCronogramaController = SendCronogramaController;
