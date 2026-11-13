"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioDetentoraController = void 0;
const RelatorioDetentoraService_1 = require("../../services/cronograma/RelatorioDetentoraService");
class RelatorioDetentoraController {
    async handle(req, res) {
        const service = new RelatorioDetentoraService_1.RelatorioDetentoraService();
        const dados = await service.execute();
        return res.json(dados);
    }
}
exports.RelatorioDetentoraController = RelatorioDetentoraController;
