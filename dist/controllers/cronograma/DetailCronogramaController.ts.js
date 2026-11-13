"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailCronogramaController = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
class DetailCronogramaController {
    async handle(req, res) {
        const { id } = req.params;
        const cronograma = await exports.prisma.cronogramaCurso.findUnique({
            where: { id },
            include: {
                professor: true,
                localAula: true,
                salaAula: true,
                formatura: true,
                bloco_curso: true,
            },
        });
        return res.json(cronograma);
    }
}
exports.DetailCronogramaController = DetailCronogramaController;
