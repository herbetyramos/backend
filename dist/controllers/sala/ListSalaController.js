"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSalaController = void 0;
const ListServiceSala_1 = require("../../services/sala/ListServiceSala");
class ListSalaController {
    async handle(req, res) {
        const listServiceSala = new ListServiceSala_1.ListServiceSala();
        const salas = await listServiceSala.execute();
        return res.json(salas);
    }
}
exports.ListSalaController = ListSalaController;
