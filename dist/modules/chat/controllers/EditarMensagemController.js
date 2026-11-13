"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditarMensagemController = void 0;
const EditarMensagemService_1 = require("../services/EditarMensagemService");
class EditarMensagemController {
    async handle(req, res) {
        try {
            const { mensagemId } = req.params;
            const { texto } = req.body;
            const service = new EditarMensagemService_1.EditarMensagemService();
            const mensagem = await service.execute({
                mensagemId,
                texto,
            });
            return res.json(mensagem);
        }
        catch (error) {
            console.error("Erro ao editar mensagem:", error);
            return res.status(400).json({
                error: error instanceof Error
                    ? error.message
                    : "Erro ao editar mensagem.",
            });
        }
    }
}
exports.EditarMensagemController = EditarMensagemController;
