import { Request, Response } from "express";
import { CreatePlanejamentoAutomaticoService } from "../../services/planejamento/CreatePlanejamentoAutomaticoService";

class CreatePlanejamentoAutomaticoController {
  async handle(req: Request, res: Response) {
    const { planeja_id } = req.params;

    const service = new CreatePlanejamentoAutomaticoService();

    const result = await service.execute({
      planeja_id,
    });

    return res.json(result);
  }
}

export { CreatePlanejamentoAutomaticoController };