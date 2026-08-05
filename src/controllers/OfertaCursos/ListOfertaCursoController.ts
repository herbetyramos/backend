import { Request, Response } from "express";
import { ListOfertaCursoService } from "../../services/OfertaCursos/ListOfertaCursoService";

class ListOfertaCursoController {
  async handle(req: Request, res: Response) {
    const service = new ListOfertaCursoService();
    const ofertas = await service.execute();
    return res.json(ofertas);
  }
}

export { ListOfertaCursoController };