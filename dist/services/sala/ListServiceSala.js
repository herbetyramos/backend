"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceSala = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceSala {
    async execute() {
        const Sala = await prisma_1.default.sala.findMany({
            select: {
                id: true,
                numero_sala: true,
                tipo_uso: true,
                local_id: true
            }
        });
        return Sala;
    }
}
exports.ListServiceSala = ListServiceSala;
