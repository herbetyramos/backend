"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlunoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ListAlunoService {
    async execute() {
        const alunos = await prisma.aluno.findMany({
            orderBy: {
                nome: "asc"
            },
            include: {
                matriculas: true
            }
        });
        return alunos;
    }
}
exports.ListAlunoService = ListAlunoService;
