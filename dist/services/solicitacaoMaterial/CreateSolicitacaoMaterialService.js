"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSolicitacaoMaterialService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateSolicitacaoMaterialService {
    async execute({ id_cronograma, observacao, itens }) {
        // Remove solicitação anterior da turma
        await prisma_1.default.solicitacaoMaterial.deleteMany({
            where: {
                id_cronograma
            }
        });
        for (const item of itens) {
            await prisma_1.default.solicitacaoMaterial.create({
                data: {
                    id_cronograma,
                    id_material: item.id_material,
                    quantidade: item.quantidade,
                    observacao
                }
            });
        }
        return {
            message: "Solicitação salva com sucesso."
        };
    }
}
exports.CreateSolicitacaoMaterialService = CreateSolicitacaoMaterialService;
