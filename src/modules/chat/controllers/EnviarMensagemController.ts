import { Request, Response } from "express";
import { EnviarMensagemService } from "../services/EnviarMensagemService";

class EnviarMensagemController {

  async handle(req: Request, res: Response) {

    const {
      conversaId,
      texto,
    } = req.body;

    const service = new EnviarMensagemService();

    const mensagem = await service.execute({
      conversaId,
      texto,
    });

    return res.json(mensagem);

  }

}

export { EnviarMensagemController };