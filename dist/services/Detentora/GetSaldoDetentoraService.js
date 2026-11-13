"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSaldoDetentoraService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GetSaldoDetentoraService {
    async execute(id) {
        const detentora = await prisma_1.default.detentora.findUnique({
            where: {
                id,
            },
            include: {
                curso: {
                    select: {
                        id: true,
                        nome_curso: true,
                    },
                },
                ata: {
                    include: {
                        empresa: {
                            select: {
                                nome_empresa: true,
                            },
                        },
                    },
                },
            },
        });
        if (!detentora) {
            throw new Error("Detentora não encontrada.");
        }
        // Conta somente os cronogramas que não estão cancelados.
        // Considera as variações de maiúsculas e minúsculas.
        const utilizadas = await prisma_1.default.cronogramaCurso.count({
            where: {
                detentoras_id: id,
                is_status: {
                    notIn: ["CANCELADO", "cancelado", "Cancelado"],
                },
            },
        });
        const contratado = detentora.quantidade_turma ?? 0;
        return {
            id: detentora.id,
            empresa: detentora.ata?.empresa?.nome_empresa ?? "-",
            ata: detentora.ata?.numero_ata ?? "-",
            curso: detentora.curso.nome_curso,
            contratado,
            utilizadas,
            saldo: contratado - utilizadas,
        };
    }
}
exports.GetSaldoDetentoraService = GetSaldoDetentoraService;
