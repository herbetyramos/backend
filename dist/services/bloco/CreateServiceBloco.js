"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceBloco = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceBloco {
    async execute({ bloco_Curso }) {
        const bloco = await prisma_1.default.blocoCurso.create({
            data: {
                bloco_Curso: bloco_Curso,
            },
            select: {
                id: true,
                bloco_Curso: true,
            }
        });
        return bloco;
    }
}
exports.CreateServiceBloco = CreateServiceBloco;
