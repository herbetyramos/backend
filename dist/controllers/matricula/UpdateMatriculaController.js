"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMatriculaController = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateMatriculaController {
    async handle(req, res) {
        const { id } = req.params;
        const matricula = await prisma_1.default.matricula.update({
            where: {
                id,
            },
            data: {
                ...req.body,
            },
        });
        return res.json(matricula);
    }
}
exports.UpdateMatriculaController = UpdateMatriculaController;
