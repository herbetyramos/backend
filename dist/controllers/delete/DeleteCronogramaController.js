"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCronogramaController = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
class DeleteCronogramaController {
    async handle(req, res) {
        const { id } = req.params;
        await exports.prisma.cronogramaCurso.delete({
            where: { id }
        });
        return res.json({
            message: "Excluído com sucesso"
        });
    }
}
exports.DeleteCronogramaController = DeleteCronogramaController;
