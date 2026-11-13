"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRelatorioSaldoDetentoraController = void 0;
const GetRelatorioSaldoDetentoraService_1 = require("../../services/Detentora/GetRelatorioSaldoDetentoraService");
class GetRelatorioSaldoDetentoraController {
    async handle(req, res) {
        const service = new GetRelatorioSaldoDetentoraService_1.GetRelatorioSaldoDetentoraService();
        const resultado = await service.execute();
        return res.json(resultado);
    }
}
exports.GetRelatorioSaldoDetentoraController = GetRelatorioSaldoDetentoraController;
