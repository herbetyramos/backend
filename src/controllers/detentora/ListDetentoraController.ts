import { Request, Response } from "express";
import { ListServiceDetentora } from "../../services/Detentora/ListServiceDetentora";

class ListDetentoraController {
  async handle(req: Request, res: Response) {
    const service = new ListServiceDetentora();
    const detentoras = await service.execute();
    return res.json(detentoras);
  }
}

export { ListDetentoraController };