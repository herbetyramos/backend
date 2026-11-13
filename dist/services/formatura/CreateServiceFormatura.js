"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceFormatura = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateServiceFormatura {
    async execute({ data_formatura, local }) {
        const formatura = await prisma_1.default.formatura.create({
            data: {
                data_formatura: data_formatura,
                local: local
            },
            select: {
                id: true,
                data_formatura: true,
                local: true
            }
        });
        return formatura;
    }
}
exports.CreateServiceFormatura = CreateServiceFormatura;
