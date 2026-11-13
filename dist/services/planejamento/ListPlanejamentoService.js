"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPlanejamentoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListPlanejamentoService {
    async execute(planeja_id) {
        const planejamento = await prisma_1.default.planejamentoAula.findMany({
            where: {
                planeja_id,
            },
            include: {
                curso_programado: {
                    select: {
                        tema: true,
                    },
                },
            },
            orderBy: {
                dia: "asc",
            },
        });
        return planejamento;
    }
}
exports.ListPlanejamentoService = ListPlanejamentoService;
