"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlunosCronogramaController = void 0;
const ListAlunosCronogramaService_1 = require("../services/ListAlunosCronogramaService");
class ListAlunosCronogramaController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new ListAlunosCronogramaService_1.ListAlunosCronogramaService();
        const alunos = await service.execute(id);
        return res.json(alunos);
    }
}
exports.ListAlunosCronogramaController = ListAlunosCronogramaController;
