"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAtaController = void 0;
const ListAtaServices_1 = require("../../services/Ata/ListAtaServices");
class ListAtaController {
    async handle(req, res) {
        const service = new ListAtaServices_1.ListAtaServices();
        const ata = await service.execute();
        return res.json(ata);
    }
}
exports.ListAtaController = ListAtaController;
