import { Request, Response } from "express";

import { whatsappClient } from "../client/WhatsAppClient";

class WebhookController {
  // ============================================================
  // STATUS
  // ============================================================

  async status(
    req: Request,
    res: Response
  ) {
    try {
      const status =
        whatsappClient.getStatus();

      return res.status(200).json({
        sucesso: true,
        conectado:
          status.conectado,
        qrCode:
          status.qrCode,
      });
    } catch (error) {
      console.error(
        "Erro ao consultar status do WhatsApp:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao consultar status do WhatsApp.",
      });
    }
  }

  // ============================================================
  // QR CODE
  // ============================================================

  async qrCode(
    req: Request,
    res: Response
  ) {
    try {
      const qrCode =
        whatsappClient.getQRCode();

      if (!qrCode) {
        return res.status(404).json({
          sucesso: false,
          mensagem:
            "QR Code não disponível.",
        });
      }

      const base64 =
        qrCode.replace(
          /^data:image\/png;base64,/,
          ""
        );

      const imagem =
        Buffer.from(
          base64,
          "base64"
        );

      res.setHeader(
        "Content-Type",
        "image/png"
      );

      res.setHeader(
        "Content-Length",
        imagem.length
      );

      return res.send(
        imagem
      );
    } catch (error) {
      console.error(
        "Erro ao obter QR Code:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          "Erro ao obter QR Code.",
      });
    }
  }

  // ============================================================
  // INICIAR
  // ============================================================

  async iniciar(
    req: Request,
    res: Response
  ) {
    try {
      await whatsappClient.iniciar();

      return res.status(200).json({
        sucesso: true,
        ...whatsappClient.getStatus(),
      });
    } catch (error) {
      console.error(
        "Erro ao iniciar WhatsApp:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          error instanceof Error
            ? error.message
            : "Erro ao iniciar WhatsApp.",
      });
    }
  }

  // ============================================================
  // DESCONECTAR
  // ============================================================

  async desconectar(
    req: Request,
    res: Response
  ) {
    try {
      await whatsappClient.desconectar();

      return res.status(200).json({
        sucesso: true,
        conectado: false,
        mensagem:
          "WhatsApp desconectado com sucesso.",
      });
    } catch (error) {
      console.error(
        "Erro ao desconectar WhatsApp:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          error instanceof Error
            ? error.message
            : "Erro ao desconectar WhatsApp.",
      });
    }
  }

  // ============================================================
  // TROCAR WHATSAPP
  // ============================================================

  async trocarWhatsApp(
    req: Request,
    res: Response
  ) {
    try {
      await whatsappClient.trocarWhatsApp();

      return res.status(200).json({
        sucesso: true,
        mensagem:
          "Troca do WhatsApp iniciada. Aguarde o novo QR Code.",
        ...whatsappClient.getStatus(),
      });
    } catch (error) {
      console.error(
        "Erro ao trocar WhatsApp:",
        error
      );

      return res.status(500).json({
        sucesso: false,
        mensagem:
          error instanceof Error
            ? error.message
            : "Erro ao trocar WhatsApp.",
      });
    }
  }
}

export default new WebhookController();