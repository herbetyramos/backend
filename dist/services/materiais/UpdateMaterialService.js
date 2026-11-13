"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterialService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UpdateMaterialService {
    async execute({ id, nome_material, propriedade, qtde }) {
        const material = await prisma.materiais.update({
            where: {
                id
            },
            data: {
                nome_material,
                propriedade,
                qtde
            }
        });
        return material;
    }
}
exports.UpdateMaterialService = UpdateMaterialService;
