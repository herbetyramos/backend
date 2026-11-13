"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMatriculaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListMatriculaService {
    async execute() {
        return await prisma_1.default.matricula.findMany({
            include: {
                aluno: true,
                cronograma: true
            }
        });
    }
}
exports.ListMatriculaService = ListMatriculaService;
