"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCursosController = void 0;
const ListCursosServices_1 = require("../../services/cursos/ListCursosServices");
class ListCursosController {
    async handle(req, res) {
        const service = new ListCursosServices_1.ListCursosServices();
        return res.json(await service.execute());
    }
}
exports.ListCursosController = ListCursosController;
