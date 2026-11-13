"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSolicitacaoMaterialService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class UpdateSolicitacaoMaterialService {
    async execute({ id, status }) {
        const solicitacao = await prisma_1.default.solicitacaoMaterial.findUnique({
            where: {
                id
            }
        });
        if (!solicitacao) {
            throw new Error("Solicitação não encontrada");
        }
        const atualizada = await prisma_1.default.solicitacaoMaterial.update({
            where: {
                id
            },
            data: {
                status
            },
            include: {
                material: true,
                cronograma: {
                    include: {
                        detentoras: {
                            include: {
                                curso: true
                            }
                        },
                        professor: true,
                        localAula: true,
                        salaAula: true
                    }
                }
            }
        });
        return atualizada;
    }
}
exports.UpdateSolicitacaoMaterialService = UpdateSolicitacaoMaterialService;
