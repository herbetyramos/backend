"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtualizarStatusConversaService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const socket_1 = require("../../../socket");
class AtualizarStatusConversaService {
    async execute({ conversaId, status, }) {
        const conversa = await prisma_1.default.conversa.findUnique({
            where: {
                id: conversaId,
            },
        });
        if (!conversa) {
            throw new Error("Conversa não encontrada.");
        }
        const conversaAtualizada = await prisma_1.default.conversa.update({
            where: {
                id: conversaId,
            },
            data: {
                status,
            },
        });
        const io = (0, socket_1.getIO)();
        io.to(conversaId).emit("statusConversaAtualizado", {
            conversaId: conversaAtualizada.id,
            status: conversaAtualizada.status,
        });
        io.emit("conversaAtualizada", {
            conversaId: conversaAtualizada.id,
            status: conversaAtualizada.status,
            ultimaMensagem: conversaAtualizada.ultimaMensagem,
            ultimaData: conversaAtualizada.ultimaData,
        });
        return conversaAtualizada;
    }
}
exports.AtualizarStatusConversaService = AtualizarStatusConversaService;
