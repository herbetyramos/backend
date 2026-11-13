"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApagarMensagemController = void 0;
const ApagarMensagemService_1 = require("../services/ApagarMensagemService");
class ApagarMensagemController {
    async handle(req, res) {
        try {
            const { mensagemId } = req.params;
            const service = new ApagarMensagemService_1.ApagarMensagemService();
            const mensagem = await service.execute({
                mensagemId,
            });
            return res.json(mensagem);
        }
        catch (error) {
            console.error("Erro ao apagar mensagem:", error);
            return res.status(400).json({
                error: error instanceof Error
                    ? error.message
                    : "Erro ao apagar mensagem.",
            });
        }
    }
}
exports.ApagarMensagemController = ApagarMensagemController;
