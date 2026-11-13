"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceBloco = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceBloco {
    async execute() {
        const bloco = await prisma_1.default.blocoCurso.findMany({
            select: {
                bloco_Curso: true,
                id: true,
            }
        });
        return bloco;
    }
}
exports.ListServiceBloco = ListServiceBloco;
