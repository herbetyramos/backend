"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMatriculaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateMatriculaService {
    async execute(data) {
        const { id, ...rest } = data;
        return prisma_1.default.matricula.update({
            where: { id },
            data: rest
        });
    }
}
exports.UpdateMatriculaService = UpdateMatriculaService;
