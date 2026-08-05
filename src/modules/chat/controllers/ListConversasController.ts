import { Request, Response } from "express";
import { ListConversasService } from "../services/ListConversasService";

class ListConversasController {
  async handle(req: Request, res: Response) {
    const { busca } = req.query;

    const service = new ListConversasService();

    const conversas = await service.execute({
      busca: busca as string,
    });

    return res.json(conversas);
  }
}

export { ListConversasController };