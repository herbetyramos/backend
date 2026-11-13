"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlanejamentoService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeletePlanejamentoService {
    async execute(id) {
        await prisma_1.default.planejamentoAula.delete({
            where: {
                id
            }
        });
        return {
            message: "Planejamento removido."
        };
    }
}
exports.DeletePlanejamentoService = DeletePlanejamentoService;
