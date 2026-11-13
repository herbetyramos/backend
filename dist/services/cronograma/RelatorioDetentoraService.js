"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatorioDetentoraService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class RelatorioDetentoraService {
    async execute() {
        const cronogramas = await prisma_1.default.cronogramaCurso.findMany({
            include: {
                professor: true,
                localAula: true,
                salaAula: true,
                bloco_curso: true,
                formatura: true,
                detentoras: {
                    include: {
                        curso: true,
                        ata: {
                            include: {
                                empresa: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                {
                    codigo: "asc"
                }
            ]
        });
        const agrupado = {};
        cronogramas.forEach((item) => {
            const empresa = item.detentoras?.ata?.empresa?.nome_empresa ??
                "SEM DETENTORA";
            const polo = item.localAula?.polo ??
                "SEM LOCAL";
            const sala = item.salaAula
                ? `${item.salaAula.numero_sala} (${item.salaAula.tipo_uso})`
                : "SEM SALA";
            if (!agrupado[empresa]) {
                agrupado[empresa] = {};
            }
            if (!agrupado[empresa][polo]) {
                agrupado[empresa][polo] = {};
            }
            if (!agrupado[empresa][polo][sala]) {
                agrupado[empresa][polo][sala] = [];
            }
            agrupado[empresa][polo][sala].push(item);
        });
        return agrupado;
    }
}
exports.RelatorioDetentoraService = RelatorioDetentoraService;
