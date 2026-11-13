"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAlunoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeleteAlunoService {
    async execute(id) {
        const aluno = await prisma.aluno.findUnique({
            where: {
                id
            },
            include: {
                matriculas: true
            }
        });
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }
        // Evita apagar aluno que possui histórico
        if (aluno.matriculas.length > 0) {
            throw new Error("Não é possível excluir aluno com matrícula cadastrada");
        }
        const alunoExcluido = await prisma.aluno.delete({
            where: {
                id
            }
        });
        return alunoExcluido;
    }
}
exports.DeleteAlunoService = DeleteAlunoService;
