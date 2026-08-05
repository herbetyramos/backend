import { Request, Response } from "express";
import { ListMateriaisCronogramaService } from "../../services/solicitacaoMaterial/ListMateriaisCronogramaService";

class ListMateriaisCronogramaController {

    async handle(req: Request, res: Response) {

        const { id } = req.query;

        const service =
            new ListMateriaisCronogramaService();

        const materiais =
            await service.execute(id as string);

        return res.json(materiais);

    }

}

export { ListMateriaisCronogramaController };