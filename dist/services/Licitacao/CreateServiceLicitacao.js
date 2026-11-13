"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceLicitacao = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceLicitacao {
    async execute({ objeto, numero_licitacao }) {
        const licitacao = await prisma_1.default.licitacao.create({
            data: {
                objeto: objeto,
                numero_licitacao: numero_licitacao
            },
            select: {
                id: true,
                numero_licitacao: true,
                objeto: true
            }
        });
        return licitacao;
    }
}
exports.CreateServiceLicitacao = CreateServiceLicitacao;
