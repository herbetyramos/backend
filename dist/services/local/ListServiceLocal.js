"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceLocal = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceLocal {
    async execute() {
        const local = await prisma_1.default.local.findMany({
            select: {
                id: true,
                polo: true,
                Telefone: true,
                Telefone2: true
            }
        });
        return local;
    }
}
exports.ListServiceLocal = ListServiceLocal;
