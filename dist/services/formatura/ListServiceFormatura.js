"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceFormatura = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceFormatura {
    async execute() {
        const formatura = await prisma_1.default.formatura.findMany({
            select: {
                id: true,
                data_formatura: true,
                local: true
            }
        });
        return formatura;
    }
}
exports.ListServiceFormatura = ListServiceFormatura;
