"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlanejamentoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdatePlanejamentoService {
    async execute({ id, conteudo }) {
        const planejamento = await prisma_1.default.planejamentoAula.update({
            where: {
                id
            },
            data: {
                conteudo
            }
        });
        return planejamento;
    }
}
exports.UpdatePlanejamentoService = UpdatePlanejamentoService;
