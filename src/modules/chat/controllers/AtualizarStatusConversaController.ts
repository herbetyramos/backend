import { Request, Response } from "express";
import { AtualizarStatusConversaService } from "../services/AtualizarStatusConversaService";

class AtualizarStatusConversaController {
  async handle(req: Request, res: Response) {
    const { conversaId } = req.params;
    const { status } = req.body;

    if (!conversaId) {
      return res.status(400).json({
        error: "ID da conversa não informado.",
      });
    }

    if (
      status !== "AGUARDANDO_ATENDIMENTO" &&
      status !== "EM_ATENDIMENTO" &&
      status !== "FINALIZADO"
    ) {
      return res.status(400).json({
        error: "Status da conversa inválido.",
      });
    }

    const service = new AtualizarStatusConversaService();

    const conversa = await service.execute({
      conversaId,
      status,
    });

    return res.json(conversa);
  }
}

export { AtualizarStatusConversaController };
