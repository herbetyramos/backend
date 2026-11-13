"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSolicitacaoCronogramaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListSolicitacaoCronogramaService {
    async execute(id_cronograma) {
        const cronograma = await prisma_1.default.cronogramaCurso.findUnique({
            where: {
                id: id_cronograma
            },
            include: {
                professor: {
                    select: {
                        nome_professor: true
                    }
                },
                localAula: {
                    select: {
                        polo: true
                    }
                },
                salaAula: {
                    select: {
                        numero_sala: true
                    }
                },
                detentoras: {
                    include: {
                        ata: {
                            include: {
                                empresa: {
                                    select: {
                                        nome_empresa: true
                                    }
                                }
                            }
                        },
                        curso: {
                            select: {
                                nome_curso: true
                            }
                        }
                    }
                }
            }
        });
        if (!cronograma) {
            throw new Error("Cronograma não encontrado.");
        }
        const materiais = await prisma_1.default.solicitacaoMaterial.findMany({
            where: {
                id_cronograma
            },
            include: {
                material: true
            },
            orderBy: {
                created_at: "asc"
            }
        });
        return {
            cronograma,
            materiais,
            observacao: materiais.find(m => m.observacao)?.observacao ?? ""
        };
    }
}
exports.ListSolicitacaoCronogramaService = ListSolicitacaoCronogramaService;
