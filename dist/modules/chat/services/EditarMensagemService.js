"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditarMensagemService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const socket_1 = require("../../../socket");
const EnviarWhatsAppService_1 = __importDefault(require("../../../whatsapp/services/EnviarWhatsAppService"));
class EditarMensagemService {
    async execute({ mensagemId, texto, }) {
        const novoTexto = texto?.trim();
        if (!mensagemId) {
            throw new Error("Mensagem não informada.");
        }
        if (!novoTexto) {
            throw new Error("O texto da mensagem não pode ser vazio.");
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
            throw new Error("Somente mensagens enviadas pelo sistema podem ser editadas.");
        }
        if (mensagem.apagada) {
            throw new Error("Não é possível editar uma mensagem apagada.");
        }
        if (!mensagem.whatsappId) {
            throw new Error("A mensagem ainda não possui ID do WhatsApp.");
        }
        if (mensagem.tipo !== "TEXTO") {
            throw new Error("Neste momento, somente mensagens de texto podem ser editadas.");
        }
        await EnviarWhatsAppService_1.default.editarMensagem(mensagem.conversa.telefone, mensagem.whatsappId, novoTexto);
        const mensagemAtualizada = await prisma_1.default.mensagem.update({
            where: {
                id: mensagem.id,
            },
            data: {
                texto: novoTexto,
                editada: true,
            },
        });
        await prisma_1.default.conversa.update({
            where: {
                id: mensagem.conversaId,
            },
            data: {
                ultimaMensagem: novoTexto,
                ultimaData: mensagemAtualizada.created_at,
            },
        });
        const io = (0, socket_1.getIO)();
        io.to(mensagem.conversaId).emit("mensagemAtualizada", mensagemAtualizada);
        io.emit("atualizarConversas");
        return mensagemAtualizada;
    }
}
exports.EditarMensagemService = EditarMensagemService;
