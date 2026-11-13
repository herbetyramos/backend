"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMensagensService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const socket_1 = require("../../../socket");
class ListMensagensService {
    async execute({ conversaId, }) {
        const conversa = await prisma_1.default.conversa.findUnique({
            where: {
                id: conversaId,
            },
            select: {
                id: true,
                nome: true,
                telefone: true,
                aluno_id: true,
                professor_id: true,
                ultimaMensagem: true,
                ultimaData: true,
                status: true,
            },
        });
        if (!conversa) {
            throw new Error("Conversa não encontrada.");
        }
        /**
         * Marca como lidas todas as mensagens
         * recebidas que ainda não foram lidas.
         */
        const resultado = await prisma_1.default.mensagem.updateMany({
            where: {
                conversaId,
                enviado: false,
                lida: false,
            },
            data: {
                lida: true,
            },
        });
        /**
         * Se alguma mensagem foi marcada como lida,
         * avisa todos os clientes conectados para que
         * a lista de conversas atualize o contador.
         */
        if (resultado.count > 0) {
            const io = (0, socket_1.getIO)();
            io.emit("conversaAtualizada", {
                conversaId: conversa.id,
                ultimaMensagem: conversa.ultimaMensagem,
                ultimaData: conversa.ultimaData,
                status: conversa.status,
            });
        }
        /**
         * Busca novamente as mensagens depois
         * da atualização.
         */
        const mensagens = await prisma_1.default.mensagem.findMany({
            where: {
                conversaId,
            },
            orderBy: {
                created_at: "asc",
            },
        });
        return {
            conversa,
            mensagens,
        };
    }
}
exports.ListMensagensService = ListMensagensService;
