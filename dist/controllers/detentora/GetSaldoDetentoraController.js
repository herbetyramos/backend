"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSaldoDetentoraController = void 0;
const GetSaldoDetentoraService_1 = require("../../services/Detentora/GetSaldoDetentoraService");
class GetSaldoDetentoraController {
    async handle(req, res) {
        try {
            const { id } = req.query;
            if (!id || typeof id !== "string") {
                return res.status(400).json({
                    error: "ID da detentora é obrigatório."
                });
            }
            const service = new GetSaldoDetentoraService_1.GetSaldoDetentoraService();
            const saldo = await service.execute(id);
            return res.json(saldo);
        }
        catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }
}
exports.GetSaldoDetentoraController = GetSaldoDetentoraController;
