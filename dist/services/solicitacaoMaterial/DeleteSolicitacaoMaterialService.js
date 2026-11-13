"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSolicitacaoMaterialService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteSolicitacaoMaterialService {
    async execute(id) {
        const solicitacao = await prisma_1.default.solicitacaoMaterial.findUnique({
            where: {
                id
            }
        });
        if (!solicitacao) {
            throw new Error("Solicitação não encontrada");
        }
        await prisma_1.default.solicitacaoMaterial.delete({
            where: {
                id
            }
        });
        return {
            mensagem: "Solicitação excluída com sucesso"
        };
    }
}
exports.DeleteSolicitacaoMaterialService = DeleteSolicitacaoMaterialService;
