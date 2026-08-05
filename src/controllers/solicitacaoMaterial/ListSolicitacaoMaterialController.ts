import { Request, Response } from "express";
import { ListSolicitacaoCronogramaService } from "../../services/solicitacaoMaterial/ListSolicitacaoMaterialService";

class ListSolicitacaoCronogramaController {

    async handle(req: Request, res: Response) {

        try {

            const { id } = req.query;

            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    error: "O parâmetro 'id' do cronograma é obrigatório."
                });
            }

            const service = new ListSolicitacaoCronogramaService();

            const result = await service.execute(id);

            return res.json(result);

        } catch (error: any) {

            return res.status(400).json({
                error: error.message
            });

        }

    }

}

export { ListSolicitacaoCronogramaController };