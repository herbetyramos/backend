"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSolicitacaoMaterialController = void 0;
const UpdateSolicitacaoMaterialService_1 = require("../../services/solicitacaoMaterial/UpdateSolicitacaoMaterialService");
class UpdateSolicitacaoMaterialController {
    async handle(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        const service = new UpdateSolicitacaoMaterialService_1.UpdateSolicitacaoMaterialService();
        const solicitacao = await service.execute({
            id,
            status
        });
        return res.json(solicitacao);
    }
}
exports.UpdateSolicitacaoMaterialController = UpdateSolicitacaoMaterialController;
