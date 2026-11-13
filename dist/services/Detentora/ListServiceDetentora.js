"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListServiceDetentora = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListServiceDetentora {
    async execute() {
        const detentora = await prisma_1.default.detentora.findMany({
            include: {
                curso: {
                    select: {
                        id: true,
                        nome_curso: true,
                        banner: true,
                    },
                },
                ata: {
                    select: {
                        id: true,
                        numero_ata: true,
                        empresa: {
                            select: {
                                nome_empresa: true,
                            },
                        },
                    },
                },
            },
        });
        return detentora;
    }
}
exports.ListServiceDetentora = ListServiceDetentora;
