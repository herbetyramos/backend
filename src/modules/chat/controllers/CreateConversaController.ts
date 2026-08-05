import { Request, Response } from "express";
import { CreateConversaService } from "../services/CreateConversaService";

class CreateConversaController {

  async handle(req: Request, res: Response) {

    const {
      telefone,
      nome,
      aluno_id,
      professor_id,
    } = req.body;

    const service = new CreateConversaService();

    const conversa = await service.execute({
      telefone,
      nome,
      aluno_id,
      professor_id,
    });

    return res.json(conversa);
  }

}

export { CreateConversaController };