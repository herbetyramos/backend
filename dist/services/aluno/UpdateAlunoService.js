"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAlunoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateAlunoService {
    async execute(data) {
        const { id, ...rest } = data;
        return await prisma_1.default.aluno.update({
            where: { id },
            data: rest
        });
    }
}
exports.UpdateAlunoService = UpdateAlunoService;
