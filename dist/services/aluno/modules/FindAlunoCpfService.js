"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAlunoCpfService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FindAlunoCpfService {
    async execute(cpf) {
        const aluno = await prisma.aluno.findUnique({
            where: {
                CPF: cpf
            },
            include: {
                matriculas: {
                    include: {
                        cronograma: true
                    }
                }
            }
        });
        if (!aluno) {
            throw new Error("Aluno não encontrado");
        }
        return aluno;
    }
}
exports.FindAlunoCpfService = FindAlunoCpfService;
