"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListConversasController = void 0;
const ListConversasService_1 = require("../services/ListConversasService");
class ListConversasController {
    async handle(req, res) {
        const { busca } = req.query;
        const service = new ListConversasService_1.ListConversasService();
        const conversas = await service.execute({
            busca: busca,
        });
        return res.json(conversas);
    }
}
exports.ListConversasController = ListConversasController;
