"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAlunoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteAlunoService {
    async execute(id) {
        return await prisma_1.default.aluno.delete({
            where: { id }
        });
    }
}
exports.DeleteAlunoService = DeleteAlunoService;
