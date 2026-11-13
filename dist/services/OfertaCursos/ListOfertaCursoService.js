"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOfertaCursoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListOfertaCursoService {
    async execute() {
        const ofertas = await prisma_1.default.cronogramaCurso.findMany({
            where: {
                publicar: true,
            },
            include: {
                localAula: true,
                detentoras: {
                    include: {
                        curso: {
                            select: {
                                id: true,
                                nome_curso: true,
                                banner: true, // pego aqui
                            }
                        }
                    }
                }
            },
            orderBy: {
                data_inicio: "asc",
            },
        });
        return ofertas;
    }
}
exports.ListOfertaCursoService = ListOfertaCursoService;
