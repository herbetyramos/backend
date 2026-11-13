"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaterialCursoService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ListMaterialCursoService {
    async execute(id_curso) {
        const materiais = await prisma.materiais.findMany({
            where: {
                id_curso
            },
            include: {
                curso: true
            },
            orderBy: {
                nome_material: "asc"
            }
        });
        return materiais;
    }
}
exports.ListMaterialCursoService = ListMaterialCursoService;
