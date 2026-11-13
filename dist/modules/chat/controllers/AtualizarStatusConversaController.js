"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarStatusConversaController = void 0;
const AtualizarStatusConversaService_1 = require("../services/AtualizarStatusConversaService");
class AtualizarStatusConversaController {
    async handle(req, res) {
        const { conversaId } = req.params;
        const { status } = req.body;
        if (!conversaId) {
            return res.status(400).json({
                error: "ID da conversa não informado.",
            });
        }
        if (status !== "AGUARDANDO_ATENDIMENTO" &&
            status !== "EM_ATENDIMENTO" &&
            status !== "FINALIZADO") {
            return res.status(400).json({
                error: "Status da conversa inválido.",
            });
        }
        const service = new AtualizarStatusConversaService_1.AtualizarStatusConversaService();
        const conversa = await service.execute({
            conversaId,
            status,
        });
        return res.json(conversa);
    }
}
exports.AtualizarStatusConversaController = AtualizarStatusConversaController;
