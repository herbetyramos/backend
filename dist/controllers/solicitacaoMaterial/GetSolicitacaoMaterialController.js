"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMateriaisCronogramaController = void 0;
const GetSolicitacaoMaterialService_1 = require("../../services/solicitacaoMaterial/GetSolicitacaoMaterialService");
class GetMateriaisCronogramaController {
    async handle(req, res) {
        const { id } = req.query;
        const service = new GetSolicitacaoMaterialService_1.GetMateriaisCronogramaService();
        const result = await service.execute(id);
        return res.json(result);
    }
}
exports.GetMateriaisCronogramaController = GetMateriaisCronogramaController;
