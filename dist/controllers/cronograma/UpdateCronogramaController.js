"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCronogramaController = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateCronogramaController {
    async handle(req, res) {
        const { id } = req.params;
        const cronograma = await prisma_1.default.cronogramaCurso.update({
            where: { id },
            data: {
                ...req.body,
            },
        });
        return res.json(cronograma);
    }
}
exports.UpdateCronogramaController = UpdateCronogramaController;
