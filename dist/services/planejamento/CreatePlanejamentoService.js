"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlanejamentoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreatePlanejamentoService {
    async execute({ planeja_id, dia, data_aula, conteudo }) {
        const existe = await prisma_1.default.planejamentoAula.findFirst({
            where: {
                planeja_id,
                dia
            }
        });
        if (existe) {
            throw new Error("Planejamento deste dia já existe.");
        }
        const planejamento = await prisma_1.default.planejamentoAula.create({
            data: {
                planeja_id,
                dia,
                data_aula,
                conteudo
            }
        });
        return planejamento;
    }
}
exports.CreatePlanejamentoService = CreatePlanejamentoService;
