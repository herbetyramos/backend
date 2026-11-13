"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMatriculaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateMatriculaService {
    async execute({ id_cronograma, id_aluno, confirmacao_curso = false, confirmacao_formatura = false, aprovado = false, justificativa }) {
        const matriculaExistente = await prisma_1.default.matricula.findFirst({
            where: {
                id_cronograma,
                id_aluno
            }
        });
        if (matriculaExistente) {
            throw new Error("Aluno já matriculado nesta turma.");
        }
        const matricula = await prisma_1.default.matricula.create({
            data: {
                id_cronograma,
                id_aluno,
                confirmacao_curso,
                confirmacao_formatura,
                aprovado,
                justificativa
            },
            include: {
                aluno: true,
                cronograma: true
            }
        });
        return matricula;
    }
}
exports.CreateMatriculaService = CreateMatriculaService;
