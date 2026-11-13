"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlanejamentoController = void 0;
const UpdatePlanejamentoService_1 = require("../../services/planejamento/UpdatePlanejamentoService");
class UpdatePlanejamentoController {
    async handle(req, res) {
        const { id } = req.params;
        const { conteudo } = req.body;
        const service = new UpdatePlanejamentoService_1.UpdatePlanejamentoService();
        const result = await service.execute({
            id,
            conteudo
        });
        return res.json(result);
    }
}
exports.UpdatePlanejamentoController = UpdatePlanejamentoController;
