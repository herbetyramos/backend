"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMateriaisCronogramaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetMateriaisCronogramaService {
    async execute(id_cronograma) {
        const cronograma = await prisma_1.default.cronogramaCurso.findUnique({
            where: {
                id: id_cronograma
            },
            include: {
                detentoras: {
                    include: {
                        curso: true
                    }
                }
            }
        });
        if (!cronograma) {
            throw new Error("Cronograma não encontrado.");
        }
        const materiais = await prisma_1.default.materiais.findMany({
            where: {
                id_curso: cronograma.detentoras?.cursos_id
            },
            orderBy: {
                nome_material: "asc"
            }
        });
        return {
            cronograma,
            materiais
        };
    }
}
exports.GetMateriaisCronogramaService = GetMateriaisCronogramaService;
