"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMensagensController = void 0;
const ListMensagensService_1 = require("../services/ListMensagensService");
class ListMensagensController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new ListMensagensService_1.ListMensagensService();
        const mensagens = await service.execute({
            conversaId: id,
        });
        return res.json(mensagens);
    }
}
exports.ListMensagensController = ListMensagensController;
