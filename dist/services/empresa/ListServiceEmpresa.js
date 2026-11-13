"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceEmpresa = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceEmpresa {
    async execute() {
        const empresa = await prisma_1.default.empresa.findMany({
            select: {
                nome_empresa: true,
                id: true
            }
        });
        return empresa;
    }
}
exports.ListServiceEmpresa = ListServiceEmpresa;
