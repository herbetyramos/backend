import { Request, Response } from "express";
import { ApagarMensagemService } from "../services/ApagarMensagemService";

class ApagarMensagemController {
  async handle(req: Request, res: Response) {
    try {
      const { mensagemId } = req.params;

      const service = new ApagarMensagemService();

      const mensagem = await service.execute({
        mensagemId,
      });

      return res.json(mensagem);
    } catch (error) {
      console.error("Erro ao apagar mensagem:", error);

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao apagar mensagem.",
      });
    }
  }
}

export { ApagarMensagemController };