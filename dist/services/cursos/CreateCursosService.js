"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCursosService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateCursosService {
    async execute({ nome_curso, price, description, segmento_id, banner }) {
        const cursos = await prisma_1.default.cursos.create({
            data: {
                nome_curso: nome_curso,
                price: price,
                description: description,
                segmento_id: segmento_id,
                banner: banner,
            }
        });
        return cursos;
    }
}
exports.CreateCursosService = CreateCursosService;
