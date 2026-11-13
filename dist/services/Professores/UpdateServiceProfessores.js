"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceProfessores = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateServiceProfessores {
    async execute({ id, nome_professor, telefone, Endereco, bairro, Numero, contato, CPF, especialidade, foto, }) {
        const professorExistente = await prisma_1.default.professor.findUnique({
            where: { id },
        });
        if (!professorExistente) {
            throw new Error("Professor não encontrado.");
        }
        const professor = await prisma_1.default.professor.update({
            where: { id },
            data: {
                nome_professor,
                telefone,
                Endereco,
                bairro,
                Numero,
                contato,
                CPF,
                especialidade,
                ...(foto !== undefined ? { foto } : {}),
                updated_at: new Date(),
            },
        });
        return professor;
    }
}
exports.UpdateServiceProfessores = UpdateServiceProfessores;
