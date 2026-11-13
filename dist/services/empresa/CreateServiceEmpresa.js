"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceEmpresa = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceEmpresa {
    async execute({ nome_empresa, representante, telefone, CNPJ }) {
        const empresa = await prisma_1.default.empresa.create({
            data: {
                nome_empresa: nome_empresa,
                representante: representante,
                telefone: telefone,
                CNPJ: CNPJ,
            },
            select: {
                id: true,
                nome_empresa: true,
            }
        });
        return empresa;
    }
}
exports.CreateServiceEmpresa = CreateServiceEmpresa;
