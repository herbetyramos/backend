"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceProfessores = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceProfessores {
    async execute({ nome_professor, telefone, Endereco, bairro, Numero, contato, CPF, especialidade, foto }) {
        const professor = await prisma_1.default.professor.create({
            data: {
                nome_professor: nome_professor,
                telefone: telefone,
                Endereco: Endereco,
                bairro: bairro,
                Numero: Numero,
                contato: contato,
                CPF: CPF,
                especialidade: especialidade,
                foto: foto,
            },
            select: {
                id: true,
                nome_professor: true,
            }
        });
        return professor;
    }
}
exports.CreateServiceProfessores = CreateServiceProfessores;
