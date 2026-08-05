import { Request, Response } from "express";
import { CreatePlanejamentoService } from "../../services/planejamento/CreatePlanejamentoService";

class CreatePlanejamentoController {

    async handle(req: Request, res: Response) {

        const {
            planeja_id,
            dia,
            data_aula,
            conteudo
        } = req.body;

        const service = new CreatePlanejamentoService();

        const result = await service.execute({
            planeja_id,
            dia: Number(dia),
            data_aula: new Date(data_aula),
            conteudo
        });

        return res.status(201).json(result);
    }

}

export { CreatePlanejamentoController };