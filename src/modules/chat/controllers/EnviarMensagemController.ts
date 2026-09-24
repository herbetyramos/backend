import { Request, Response } from "express";

import { EnviarMensagemService } from "../services/EnviarMensagemService";

class EnviarMensagemController {
  async handle(req: Request, res: Response) {
    try {
      const { conversaId, texto } = req.body;

      const arquivo = req.file;

      if (!conversaId) {
        throw new Error(
          "Conversa não informada."
        );
      }

      const service =
        new EnviarMensagemService();

      const mensagem =
        await service.execute({
          conversaId,
          texto: texto || "",
          arquivo: arquivo?.buffer,
          mimeType: arquivo?.mimetype,
          nomeArquivo: arquivo?.originalname,
          tamanho: arquivo?.size,
        });

      return res.json(mensagem);
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem:",
        error
      );

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao enviar mensagem.",
      });
    }
  }
}

export { EnviarMensagemController };