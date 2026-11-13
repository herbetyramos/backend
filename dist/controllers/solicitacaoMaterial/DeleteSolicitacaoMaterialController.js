"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSolicitacaoMaterialController = void 0;
const DeleteSolicitacaoMaterialService_1 = require("../../services/solicitacaoMaterial/DeleteSolicitacaoMaterialService");
class DeleteSolicitacaoMaterialController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new DeleteSolicitacaoMaterialService_1.DeleteSolicitacaoMaterialService();
        const resultado = await service.execute(id);
        return res.json(resultado);
    }
}
exports.DeleteSolicitacaoMaterialController = DeleteSolicitacaoMaterialController;
