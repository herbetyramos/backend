"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMatriculaService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ListMatriculaService {
    async execute() {
        const matriculas = await prisma.matricula.findMany({
            include: {
                aluno: true,
                cronograma: {
                    include: {
                        bloco_curso: true,
                        professor: true,
                        localAula: true,
                        salaAula: true,
                        formatura: true
                    }
                }
            },
            orderBy: [
                {
                    cronograma: {
                        data_inicio: "desc"
                    }
                },
                {
                    aluno: {
                        nome: "asc"
                    }
                }
            ]
        });
        return matriculas;
    }
}
exports.ListMatriculaService = ListMatriculaService;
