"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAlunoController = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateAlunoController {
    async handle(req, res) {
        const { id } = req.params;
        const aluno = await prisma_1.default.aluno.update({
            where: {
                id,
            },
            data: {
                ...req.body,
            },
        });
        return res.json(aluno);
    }
}
exports.UpdateAlunoController = UpdateAlunoController;
