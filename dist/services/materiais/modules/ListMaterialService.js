"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaterialService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ListMaterialService {
    async execute() {
        const materiais = await prisma.materiais.findMany({
            include: {
                curso: {
                    select: {
                        id: true,
                        nome_curso: true
                    }
                }
            },
            orderBy: [
                {
                    curso: {
                        nome_curso: "asc"
                    }
                },
                {
                    nome_material: "asc"
                }
            ]
        });
        return materiais;
    }
}
exports.ListMaterialService = ListMaterialService;
