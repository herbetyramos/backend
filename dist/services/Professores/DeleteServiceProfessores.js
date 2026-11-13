"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteServiceProfessores = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteServiceProfessores {
    async execute(id) {
        const professor = await prisma_1.default.professor.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        CronogramaCursos: true,
                    },
                },
            },
        });
        if (!professor) {
            throw new Error("Professor não encontrado.");
        }
        if (professor._count.CronogramaCursos > 0) {
            throw new Error("Não é possível excluir este professor porque ele está vinculado a um ou mais cronogramas.");
        }
        return prisma_1.default.professor.delete({
            where: { id },
        });
    }
}
exports.DeleteServiceProfessores = DeleteServiceProfessores;
