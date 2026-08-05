import { Request, Response } from "express";
import { ListAtaServices } from "../../services/Ata/ListAtaServices";

class ListAtaController {
  async handle(req: Request, res: Response) {
    const service = new ListAtaServices();
    const ata = await service.execute();
    return res.json(ata);
  }
}

export { ListAtaController };