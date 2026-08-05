import { Request, Response } from "express";
import { GetMateriaisCronogramaService } from "../../services/solicitacaoMaterial/GetSolicitacaoMaterialService";

class GetMateriaisCronogramaController {

    async handle(req: Request, res: Response) {

        const { id } = req.query;

        const service = new GetMateriaisCronogramaService();

        const result = await service.execute(id as string);

        return res.json(result);

    }

}

export { GetMateriaisCronogramaController };