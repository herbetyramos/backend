"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMatriculaController = void 0;
const ListMatriculaService_1 = require("../../services/matricula/ListMatriculaService");
class ListMatriculaController {
    async handle(req, res) {
        const service = new ListMatriculaService_1.ListMatriculaService();
        return res.json(await service.execute());
    }
}
exports.ListMatriculaController = ListMatriculaController;
