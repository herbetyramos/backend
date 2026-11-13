"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlunoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CreateAlunoService {
    async execute({ nome, CPF, celular, email, Telefone_recado }) {
        // Verifica se CPF já existe
        const alunoExiste = await prisma.aluno.findUnique({
            where: {
                CPF
            }
        });
        if (alunoExiste) {
            throw new Error("Aluno já cadastrado com este CPF");
        }
        // Cria aluno
        const aluno = await prisma.aluno.create({
            data: {
                nome,
                CPF,
                celular,
                email,
                Telefone_recado
            }
        });
        return aluno;
    }
}
exports.CreateAlunoService = CreateAlunoService;
