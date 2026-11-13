"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPlanejamentoController = void 0;
const ListPlanejamentoService_1 = require("../../services/planejamento/ListPlanejamentoService");
class ListPlanejamentoController {
    async handle(req, res) {
        const { planeja_id } = req.params;
        const service = new ListPlanejamentoService_1.ListPlanejamentoService();
        const lista = await service.execute(planeja_id);
        return res.json(lista);
    }
}
exports.ListPlanejamentoController = ListPlanejamentoController;
