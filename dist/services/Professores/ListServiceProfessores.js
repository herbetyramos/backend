"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceProfessores = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceProfessores {
    async execute() {
        const professor = await prisma_1.default.professor.findMany({
            select: {
                id: true,
                nome_professor: true,
            }
        });
        return professor;
    }
}
exports.ListServiceProfessores = ListServiceProfessores;
