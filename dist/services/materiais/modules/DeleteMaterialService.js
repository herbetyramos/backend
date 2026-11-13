"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMaterialService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DeleteMaterialService {
    async execute(id) {
        await prisma.materiais.delete({
            where: {
                id
            }
        });
        return {
            message: "Material excluído com sucesso"
        };
    }
}
exports.DeleteMaterialService = DeleteMaterialService;
