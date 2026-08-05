import { Request, Response } from "express";
import { RelatorioDetentoraService } from "../../services/cronograma/RelatorioDetentoraService";


class RelatorioDetentoraController {
  async handle(req: Request, res: Response) {
    const service = new RelatorioDetentoraService();

    const dados = await service.execute();

    return res.json(dados);
  }
}

export { RelatorioDetentoraController };