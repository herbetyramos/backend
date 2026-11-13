"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAlunoController = void 0;
const DeleteAlunoService_1 = require("../../../services/aluno/modules/DeleteAlunoService");
class DeleteAlunoController {
    async handle(req, res) {
        const { id } = req.params;
        const deleteAlunoService = new DeleteAlunoService_1.DeleteAlunoService();
        const aluno = await deleteAlunoService.execute(id);
        return res.json(aluno);
    }
}
exports.DeleteAlunoController = DeleteAlunoController;
