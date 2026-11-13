"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSolicitacaoCronogramaController = void 0;
const ListSolicitacaoMaterialService_1 = require("../../services/solicitacaoMaterial/ListSolicitacaoMaterialService");
class ListSolicitacaoCronogramaController {
    async handle(req, res) {
        try {
            const { id } = req.query;
            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    error: "O parâmetro 'id' do cronograma é obrigatório."
                });
            }
            const service = new ListSolicitacaoMaterialService_1.ListSolicitacaoCronogramaService();
            const result = await service.execute(id);
            return res.json(result);
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
}
exports.ListSolicitacaoCronogramaController = ListSolicitacaoCronogramaController;
