"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlanejamentoAutomaticoController = void 0;
const CreatePlanejamentoAutomaticoService_1 = require("../../services/planejamento/CreatePlanejamentoAutomaticoService");
class CreatePlanejamentoAutomaticoController {
    async handle(req, res) {
        const { planeja_id } = req.params;
        const service = new CreatePlanejamentoAutomaticoService_1.CreatePlanejamentoAutomaticoService();
        const result = await service.execute({
            planeja_id,
        });
        return res.json(result);
    }
}
exports.CreatePlanejamentoAutomaticoController = CreatePlanejamentoAutomaticoController;
