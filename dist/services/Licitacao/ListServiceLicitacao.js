"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceLicitacao = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceLicitacao {
    async execute() {
        const licitacao = await prisma_1.default.licitacao.findMany({
            select: {
                numero_licitacao: true,
                objeto: true,
                id: true,
            }
        });
        return licitacao;
    }
}
exports.ListServiceLicitacao = ListServiceLicitacao;
