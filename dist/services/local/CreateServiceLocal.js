"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceLocal = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceLocal {
    async execute({ polo, Telefone, Telefone2 }) {
        const local = await prisma_1.default.local.create({
            data: {
                polo: polo,
                Telefone: Telefone,
                Telefone2: Telefone2,
            },
            select: {
                id: true,
                polo: true,
            }
        });
        return local;
    }
}
exports.CreateServiceLocal = CreateServiceLocal;
