"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceSala = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceSala {
    async execute({ numero_sala, local_id, tipo_uso }) {
        const sala = await prisma_1.default.sala.create({
            data: {
                numero_sala: numero_sala,
                local_id: local_id,
                tipo_uso: tipo_uso
            },
            select: {
                id: true,
                numero_sala: true,
                local_id: true,
                tipo_uso: true
            }
        });
        return sala;
    }
}
exports.CreateServiceSala = CreateServiceSala;
