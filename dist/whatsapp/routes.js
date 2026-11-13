"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const WebhookController_1 = __importDefault(require("./controllers/WebhookController"));
const EnviarWhatsAppService_1 = __importDefault(require("./services/EnviarWhatsAppService"));
const router = (0, express_1.Router)();
// ============================================================
// WHATSAPP
// ============================================================
router.get("/status", WebhookController_1.default.status);
router.get("/qrcode", WebhookController_1.default.qrCode);
router.post("/iniciar", WebhookController_1.default.iniciar);
router.post("/desconectar", WebhookController_1.default.desconectar);
router.post("/trocar", WebhookController_1.default.trocarWhatsApp);
// ============================================================
// ENVIAR TEXTO
// ============================================================
router.post("/enviar", async (req, res) => {
    try {
        const { telefone, texto, } = req.body;
        if (!telefone) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Telefone não informado.",
            });
        }
        if (!texto) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Texto não informado.",
            });
        }
        const resultado = await EnviarWhatsAppService_1.default.execute(telefone, texto);
        return res.status(200).json({
            sucesso: true,
            mensagem: "Mensagem enviada com sucesso.",
            resultado,
        });
    }
    catch (error) {
        console.error("Erro ao enviar mensagem pelo WhatsApp:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: error instanceof Error
                ? error.message
                : "Erro ao enviar mensagem pelo WhatsApp.",
        });
    }
});
exports.default = router;
