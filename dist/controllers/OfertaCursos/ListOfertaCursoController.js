"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOfertaCursoController = void 0;
const ListOfertaCursoService_1 = require("../../services/OfertaCursos/ListOfertaCursoService");
class ListOfertaCursoController {
    async handle(req, res) {
        const service = new ListOfertaCursoService_1.ListOfertaCursoService();
        const ofertas = await service.execute();
        return res.json(ofertas);
    }
}
exports.ListOfertaCursoController = ListOfertaCursoController;
