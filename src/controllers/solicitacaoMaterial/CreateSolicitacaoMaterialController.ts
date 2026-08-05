import { Request, Response } from "express";
import { CreateSolicitacaoMaterialService } from "../../services/solicitacaoMaterial/CreateSolicitacaoMaterialService";

class CreateSolicitacaoMaterialController {

    async handle(req: Request, res: Response){

        const {
            id_cronograma,
            observacao,
            itens
        } = req.body;

        const service = new CreateSolicitacaoMaterialService();

        const result = await service.execute({
            id_cronograma,
            observacao,
            itens
        });

        return res.json(result);

    }

}

export { CreateSolicitacaoMaterialController };