"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlanejamentoController = void 0;
const DeletePlanejamentoService_1 = require("../../services/planejamento/DeletePlanejamentoService");
class DeletePlanejamentoController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new DeletePlanejamentoService_1.DeletePlanejamentoService();
        const result = await service.execute(id);
        return res.json(result);
    }
}
exports.DeletePlanejamentoController = DeletePlanejamentoController;
