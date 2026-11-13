"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindServiceProfessores = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class FindServiceProfessores {
    async execute(id) {
        const professor = await prisma_1.default.professor.findUnique({
            where: { id },
            select: {
                id: true,
                nome_professor: true,
                telefone: true,
                Endereco: true,
                bairro: true,
                Numero: true,
                contato: true,
                CPF: true,
                especialidade: true,
                foto: true,
                created_at: true,
                updated_at: true,
            },
        });
        if (!professor) {
            throw new Error("Professor não encontrado.");
        }
        return professor;
    }
}
exports.FindServiceProfessores = FindServiceProfessores;
