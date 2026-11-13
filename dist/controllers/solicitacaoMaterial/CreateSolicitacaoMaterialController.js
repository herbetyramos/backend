"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSolicitacaoMaterialController = void 0;
const CreateSolicitacaoMaterialService_1 = require("../../services/solicitacaoMaterial/CreateSolicitacaoMaterialService");
class CreateSolicitacaoMaterialController {
    async handle(req, res) {
        const { id_cronograma, observacao, itens } = req.body;
        const service = new CreateSolicitacaoMaterialService_1.CreateSolicitacaoMaterialService();
        const result = await service.execute({
            id_cronograma,
            observacao,
            itens
        });
        return res.json(result);
    }
}
exports.CreateSolicitacaoMaterialController = CreateSolicitacaoMaterialController;
