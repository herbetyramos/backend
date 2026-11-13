"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCronogramaController = void 0;
const ListCronogramaService_1 = require("../../services/listCronograma/ListCronogramaService");
class ListCronogramaController {
    async handle(req, res) {
        const service = new ListCronogramaService_1.ListCronogramaService();
        const cronograma = await service.execute();
        return res.json(cronograma);
    }
}
exports.ListCronogramaController = ListCronogramaController;
