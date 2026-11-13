"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAtaServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListAtaServices {
    async execute() {
        const ata = await prisma_1.default.ata.findMany({
            select: {
                id: true,
                numero_ata: true,
                licitacao_id: true,
                id_empresa: true,
                empresa: {
                    select: {
                        nome_empresa: true,
                    },
                },
            },
            orderBy: {
                numero_ata: "asc",
            },
        });
        return ata;
    }
}
exports.ListAtaServices = ListAtaServices;
