"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalvarTudoPlanejamentoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class SalvarTudoPlanejamentoService {
    async execute({ planejamentos }) {
        // Atualiza todos os registros em uma única transação
        await prisma_1.default.$transaction(planejamentos.map((item) => prisma_1.default.planejamentoAula.update({
            where: {
                id: item.id,
            },
            data: {
                conteudo: item.conteudo,
                finalizado: true,
            },
        })));
        return {
            message: "Planejamento salvo com sucesso.",
        };
    }
}
exports.SalvarTudoPlanejamentoService = SalvarTudoPlanejamentoService;
