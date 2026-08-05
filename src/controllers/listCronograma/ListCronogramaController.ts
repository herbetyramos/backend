import { Request, Response } from "express";
import { ListCronogramaService } from "../../services/listCronograma/ListCronogramaService";

export class ListCronogramaController {
  async handle(req: Request, res: Response) {
    const service = new ListCronogramaService();
    const cronograma = await service.execute();
    return res.json(cronograma);
  }
}