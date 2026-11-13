"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlanejamentoController = void 0;
const CreatePlanejamentoService_1 = require("../../services/planejamento/CreatePlanejamentoService");
class CreatePlanejamentoController {
    async handle(req, res) {
        const { planeja_id, dia, data_aula, conteudo } = req.body;
        const service = new CreatePlanejamentoService_1.CreatePlanejamentoService();
        const result = await service.execute({
            planeja_id,
            dia: Number(dia),
            data_aula: new Date(data_aula),
            conteudo
        });
        return res.status(201).json(result);
    }
}
exports.CreatePlanejamentoController = CreatePlanejamentoController;
