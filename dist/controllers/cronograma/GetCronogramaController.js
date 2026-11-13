"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCronogramaController = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetCronogramaController {
    async handle(req, res) {
        const { id } = req.params;
        const cronograma = await prisma_1.default.cronogramaCurso.findUnique({
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
exports.GetCronogramaController = GetCronogramaController;
