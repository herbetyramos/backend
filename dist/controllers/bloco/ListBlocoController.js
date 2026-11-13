"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListBlocoController = void 0;
const ListServiceBloco_1 = require("../../services/bloco/ListServiceBloco");
class ListBlocoController {
    async handle(req, res) {
        const listServiceBloco = new ListServiceBloco_1.ListServiceBloco();
        const blocos = await listServiceBloco.execute();
        return res.json(blocos);
    }
}
exports.ListBlocoController = ListBlocoController;
