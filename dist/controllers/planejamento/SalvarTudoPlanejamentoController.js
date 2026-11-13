"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalvarTudoPlanejamentoController = void 0;
const SalvarTudoPlanejamentoService_1 = require("../../services/planejamento/SalvarTudoPlanejamentoService");
class SalvarTudoPlanejamentoController {
    async handle(req, res) {
        const { planejamentos } = req.body;
        const service = new SalvarTudoPlanejamentoService_1.SalvarTudoPlanejamentoService();
        const result = await service.execute({
            planejamentos,
        });
        return res.json(result);
    }
}
exports.SalvarTudoPlanejamentoController = SalvarTudoPlanejamentoController;
