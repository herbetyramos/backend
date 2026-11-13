"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListConversasService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class ListConversasService {
    async execute({ busca }) {
        const conversas = await prisma_1.default.conversa.findMany({
            where: busca
                ? {
                    OR: [
                        {
                            nome: {
                                contains: busca,
                                mode: "insensitive",
                            },
                        },
                        {
                            telefone: {
                                contains: busca,
                            },
                        },
                    ],
                }
                : undefined,
            include: {
                _count: {
                    select: {
                        mensagens: {
                            where: {
                                enviado: false,
                                lida: false,
                            },
                        },
                    },
                },
            },
            orderBy: [
                {
                    ultimaData: "desc",
                },
            ],
        });
        return conversas.map((conversa) => ({
            id: conversa.id,
            telefone: conversa.telefone,
            nome: conversa.nome,
            ultimaMensagem: conversa.ultimaMensagem,
            ultimaData: conversa.ultimaData,
            status: conversa.status,
            naoLidas: conversa._count.mensagens,
        }));
    }
}
exports.ListConversasService = ListConversasService;
