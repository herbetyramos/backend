"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificadoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CertificadoService {
    async execute(id_cronograma) {
        const alunos = await prisma_1.default.matricula.findMany({
            where: {
                id_cronograma,
                aprovado: true
            },
            include: {
                aluno: true,
                cronograma: {
                    include: {
                        professor: true,
                        bloco_curso: true,
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
                    }
                }
            }
        });
        return alunos;
    }
}
exports.CertificadoService = CertificadoService;
