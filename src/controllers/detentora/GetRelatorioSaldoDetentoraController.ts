import { Request, Response } from "express";
import { GetRelatorioSaldoDetentoraService } from "../../services/Detentora/GetRelatorioSaldoDetentoraService";

class GetRelatorioSaldoDetentoraController {
  async handle(req: Request, res: Response) {
    const service = new GetRelatorioSaldoDetentoraService();

    const resultado = await service.execute();

    return res.json(resultado);
  }
}

export { GetRelatorioSaldoDetentoraController };