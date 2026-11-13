"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceSegmentos = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceSegmentos {
    async execute() {
        const segmentos = await prisma_1.default.segmento.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return segmentos;
    }
}
exports.ListServiceSegmentos = ListServiceSegmentos;
