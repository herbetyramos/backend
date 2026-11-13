
import { Request, Response } from "express";
import { SalvarTudoPlanejamentoService } from "../../services/planejamento/SalvarTudoPlanejamentoService";

class SalvarTudoPlanejamentoController {
  async handle(req: Request, res: Response) {
    const { planejamentos } = req.body;

    if (!Array.isArray(planejamentos)) {
      return res.status(400).json({
        error: "Os dados do planejamento são inválidos.",
      });
    }

    const service = new SalvarTudoPlanejamentoService();

    const result = await service.execute({
      planejamentos,
    });

    if ("bloqueado" in result && result.bloqueado) {
      return res.status(403).json({
        error: result.message,
      });
    }

    return res.json(result);
  }
}

export { SalvarTudoPlanejamentoController };
