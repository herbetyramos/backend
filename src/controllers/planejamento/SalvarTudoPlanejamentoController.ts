import { Request, Response } from "express";
import { SalvarTudoPlanejamentoService } from "../../services/planejamento/SalvarTudoPlanejamentoService";

class SalvarTudoPlanejamentoController {
  async handle(req: Request, res: Response) {

    const { planejamentos } = req.body;

    const service = new SalvarTudoPlanejamentoService();

    const result = await service.execute({
      planejamentos,
    });

    return res.json(result);
  }
}

export { SalvarTudoPlanejamentoController };