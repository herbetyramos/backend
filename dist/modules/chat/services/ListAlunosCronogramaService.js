"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlunosCronogramaService = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class ListAlunosCronogramaService {
    async execute(id) {
        const cronograma = await prisma_1.default.cronogramaCurso.findUnique({
            where: {
                id,
            },
            include: {
                matriculas: {
                    include: {
                        aluno: true,
                    },
                },
            },
        });
        if (!cronograma) {
            throw new Error("Cronograma não encontrado.");
        }
        return {
            alunos: cronograma.matriculas.map((item) => ({
                id: item.aluno.id,
                nome: item.aluno.nome,
                telefone: item.aluno.celular,
            })),
        };
    }
}
exports.ListAlunosCronogramaService = ListAlunosCronogramaService;
