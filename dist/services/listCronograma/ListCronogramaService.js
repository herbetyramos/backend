"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCronogramaService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListCronogramaService {
    async execute() {
        const cronogramas = await prisma_1.default.cronogramaCurso.findMany({
            orderBy: {
                codigo: "asc",
            },
            include: {
                bloco_curso: true,
                localAula: true,
                salaAula: true,
                professor: {
                    select: {
                        id: true,
                        nome_professor: true,
                        telefone: true,
                        especialidade: true,
                        foto: true,
                    },
                },
                formatura: true,
                detentoras: {
                    include: {
                        ata: {
                            include: {
                                empresa: true,
                            },
                        },
                        curso: {
                            include: {
                                segmento: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        matriculas: true,
                    },
                },
            },
        });
        const resultado = await Promise.all(cronogramas.map(async (cronograma) => {
            const { _count, ...dadosCronograma } = cronograma;
            // ==========================================
            // SEM DETENTORA
            // ==========================================
            if (!cronograma.detentoras) {
                return {
                    ...dadosCronograma,
                    quantidadeAlunos: _count.matriculas,
                    saldoDetentora: null,
                };
            }
            // ==========================================
            // QUANTIDADE CONTRATADA
            // ==========================================
            const contratado = cronograma.detentoras.quantidade_turma ?? 0;
            // ==========================================
            // TURMAS UTILIZADAS
            //
            // ATIVO E SUSPENSO: CONSUMEM SALDO
            // CANCELADO: NÃO CONSOME SALDO
            // ==========================================
            const utilizadas = await prisma_1.default.cronogramaCurso.count({
                where: {
                    detentoras_id: cronograma.detentoras.id,
                    is_status: {
                        not: "CANCELADO",
                        mode: "insensitive",
                    },
                },
            });
            // ==========================================
            // SALDO
            // ==========================================
            const saldo = contratado - utilizadas;
            // ==========================================
            // RETORNO
            // ==========================================
            return {
                ...dadosCronograma,
                quantidadeAlunos: _count.matriculas,
                saldoDetentora: {
                    empresa: cronograma.detentoras.ata
                        ?.empresa
                        ?.nome_empresa ?? "",
                    ata: cronograma.detentoras.ata
                        ?.numero_ata ?? "",
                    curso: cronograma.detentoras.curso
                        ?.nome_curso ?? "",
                    contratado,
                    utilizadas,
                    saldo,
                },
            };
        }));
        return resultado;
    }
}
exports.ListCronogramaService = ListCronogramaService;
