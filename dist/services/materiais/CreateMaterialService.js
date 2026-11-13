"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMaterialService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CreateMaterialService {
    async execute({ id_curso, propriedade, nome_material, qtde, }) {
        const curso = await prisma.cursos.findUnique({
            where: {
                id: id_curso
            }
        });
        if (!curso) {
            throw new Error("Curso não encontrado.");
        }
        const materialExiste = await prisma.materiais.findFirst({
            where: {
                id_curso,
                nome_material
            }
        });
        if (materialExiste) {
            throw new Error("Este material já está cadastrado para este curso.");
        }
        const material = await prisma.materiais.create({
            data: {
                nome_material,
                propriedade,
                qtde,
                curso: {
                    connect: {
                        id: id_curso
                    }
                }
            }
        });
        return material;
    }
}
exports.CreateMaterialService = CreateMaterialService;
