"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServiceDetentora = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateServiceDetentora {
    async execute({ id, ata_id, cursos_id, quantidade_turma, valor_curso, ativo, }) {
        const detentora = await prisma_1.default.detentora.update({
            where: { id },
            data: {
                ...(ata_id !== undefined && { ata_id }),
                ...(cursos_id !== undefined && { cursos_id }),
                ...(quantidade_turma !== undefined && {
                    quantidade_turma,
                }),
                ...(valor_curso !== undefined && {
                    valor_curso: String(valor_curso),
                }),
                ...(ativo !== undefined && { ativo }),
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
exports.UpdateServiceDetentora = UpdateServiceDetentora;
