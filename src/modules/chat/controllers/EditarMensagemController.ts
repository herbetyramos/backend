import { Request, Response } from "express";
import { EditarMensagemService } from "../services/EditarMensagemService";

class EditarMensagemController {
  async handle(req: Request, res: Response) {
    try {
      const { mensagemId } = req.params;
      const { texto } = req.body;

      const service = new EditarMensagemService();

      const mensagem = await service.execute({
        mensagemId,
        texto,
      });

      return res.json(mensagem);
    } catch (error) {
      console.error("Erro ao editar mensagem:", error);

      return res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Erro ao editar mensagem.",
      });
    }
  }
}

export { EditarMensagemController };