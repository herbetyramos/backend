import { Router } from "express";

import WebhookController from "./controllers/WebhookController";

import EnviarWhatsAppService from "./services/EnviarWhatsAppService";

const router = Router();

// ============================================================
// WHATSAPP
// ============================================================

router.get(
  "/status",
  WebhookController.status
);

router.get(
  "/qrcode",
  WebhookController.qrCode
);

router.post(
  "/iniciar",
  WebhookController.iniciar
);

router.post(
  "/desconectar",
  WebhookController.desconectar
);

router.post(
  "/trocar",
  WebhookController.trocarWhatsApp
);

// ============================================================
// ENVIAR TEXTO
// ============================================================

router.post(
  "/enviar",
  async (req, res) => {
    try {
      const {
        telefone,
        texto,
      } = req.body;

      if (!telefone) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Telefone não informado.",
        });
      }

      if (!texto) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Texto não informado.",
        });
      }

      const resultado =
        await EnviarWhatsAppService.execute(
          telefone,
          texto
        );

      return res.status(200).json({
        sucesso: true,
        mensagem:
          "Mensagem enviada com sucesso.",
        resultado,
      });
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem pelo WhatsApp:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          error instanceof Error
            ? error.message
            : "Erro ao enviar mensagem pelo WhatsApp.",
      });
    }
  }
);

export default router;