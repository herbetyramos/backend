"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaterialService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ListMaterialService {
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
exports.ListMaterialService = ListMaterialService;
