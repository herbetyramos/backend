import { Request, Response } from "express";
import { ListMensagensService } from "../services/ListMensagensService";

class ListMensagensController {

  async handle(req: Request, res: Response) {

    const { id } = req.params;

    const service = new ListMensagensService();

    const mensagens = await service.execute({
      conversaId: id,
    });

    return res.json(mensagens);

  }

}

export { ListMensagensController };