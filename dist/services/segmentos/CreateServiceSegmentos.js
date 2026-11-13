"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceSegmentos = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceSegmentos {
    async execute({ name }) {
        if (name === '') {
            throw new Error('Nome invalido');
        }
        const segmento = await prisma_1.default.segmento.create({
            data: {
                name: name,
            },
            select: {
                id: true,
                name: true,
            }
        });
        return segmento;
    }
}
exports.CreateServiceSegmentos = CreateServiceSegmentos;
