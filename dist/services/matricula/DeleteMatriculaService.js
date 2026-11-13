"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatriculaService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeleteMatriculaService {
    async execute(id) {
        const matricula = await prisma.matricula.findUnique({
            where: {
                id
            }
        });
        if (!matricula) {
            throw new Error("Matrícula não encontrada.");
        }
        await prisma.matricula.delete({
            where: {
                id
            }
        });
        return true;
    }
}
exports.DeleteMatriculaService = DeleteMatriculaService;
