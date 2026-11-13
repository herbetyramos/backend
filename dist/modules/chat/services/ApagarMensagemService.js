"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApagarMensagemService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const socket_1 = require("../../../socket");
const EnviarWhatsAppService_1 = __importDefault(require("../../../whatsapp/services/EnviarWhatsAppService"));
class ApagarMensagemService {
    async execute({ mensagemId, }) {
        if (!mensagemId) {
            throw new Error("Mensagem não informada.");
        }
        const mensagem = await prisma_1.default.mensagem.findUnique({
            where: {
                id: mensagemId,
            },
            include: {
                conversa: true,
            },
        });
        if (!mensagem) {
            throw new Error("Mensagem não encontrada.");
        }
        if (!mensagem.enviado) {
            throw new Error("Somente mensagens enviadas pelo sistema podem ser apagadas.");
        }
        if (mensagem.apagada) {
            throw new Error("A mensagem já foi apagada.");
        }
        if (!mensagem.whatsappId) {
            throw new Error("A mensagem ainda não possui ID do WhatsApp.");
        }
        await EnviarWhatsAppService_1.default.apagarMensagem(mensagem.conversa.telefone, mensagem.whatsappId);
        const mensagemAtualizada = await prisma_1.default.mensagem.update({
            where: {
                id: mensagem.id,
            },
            data: {
                texto: "Mensagem apagada",
                apagada: true,
            },
        });
        await prisma_1.default.conversa.update({
            where: {
                id: mensagem.conversaId,
            },
            data: {
                ultimaMensagem: "Mensagem apagada",
                ultimaData: mensagemAtualizada.created_at,
            },
        });
        const io = (0, socket_1.getIO)();
        io.to(mensagem.conversaId).emit("mensagemAtualizada", mensagemAtualizada);
        io.emit("atualizarConversas");
        return mensagemAtualizada;
    }
}
exports.ApagarMensagemService = ApagarMensagemService;
