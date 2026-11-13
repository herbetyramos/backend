"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceDetentora = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceDetentora {
    async execute({ ata_id, cursos_id, quantidade_turma, valor_curso = 0, ativo = true, }) {
        const detentora = await prisma_1.default.detentora.create({
            data: {
                ata_id: ata_id || null,
                cursos_id,
                quantidade_turma,
                valor_curso,
                ativo,
            },
            select: {
                id: true,
                ata_id: true,
                cursos_id: true,
                quantidade_turma: true,
                valor_curso: true,
                ativo: true,
                curso: true,
                ata: true,
            },
        });
        return detentora;
    }
}
exports.CreateServiceDetentora = CreateServiceDetentora;
