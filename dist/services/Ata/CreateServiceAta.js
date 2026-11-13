"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceAta = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceAta {
    async execute({ numero_ata, licitacao_id, id_empresa }) {
        const ata = await prisma_1.default.ata.create({
            data: {
                numero_ata,
                licitacao_id,
                id_empresa,
            },
            select: {
                id: true,
                numero_ata: true,
                licitacao_id: true,
                id_empresa: true,
            }
        });
        return ata;
    }
}
exports.CreateServiceAta = CreateServiceAta;
