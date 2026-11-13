"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAlunoController = void 0;
const ListAlunoService_1 = require("../../services/aluno/ListAlunoService");
class ListAlunoController {
    async handle(req, res) {
        const listAlunoService = new ListAlunoService_1.ListAlunoService();
        const alunos = await listAlunoService.execute();
        return res.json(alunos);
    }
}
exports.ListAlunoController = ListAlunoController;
