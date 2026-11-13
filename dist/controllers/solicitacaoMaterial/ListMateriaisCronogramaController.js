"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMateriaisCronogramaController = void 0;
const ListMateriaisCronogramaService_1 = require("../../services/solicitacaoMaterial/ListMateriaisCronogramaService");
class ListMateriaisCronogramaController {
    async handle(req, res) {
        const { id } = req.query;
        const service = new ListMateriaisCronogramaService_1.ListMateriaisCronogramaService();
        const materiais = await service.execute(id);
        return res.json(materiais);
    }
}
exports.ListMateriaisCronogramaController = ListMateriaisCronogramaController;
