"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCursosServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListCursosServices {
    async execute() {
        return await prisma_1.default.cursos.findMany({
            select: {
                id: true,
                nome_curso: true,
            }
        });
    }
}
exports.ListCursosServices = ListCursosServices;
