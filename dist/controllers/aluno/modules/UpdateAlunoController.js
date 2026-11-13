"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAlunoController = void 0;
const UpdateAlunoService_1 = require("../../../services/aluno/modules/UpdateAlunoService");
class UpdateAlunoController {
    async handle(req, res) {
        const { id } = req.params;
        const { nome, CPF, celular, email, Telefone_recado } = req.body;
        const updateAlunoService = new UpdateAlunoService_1.UpdateAlunoService();
        const aluno = await updateAlunoService.execute({
            id,
            nome,
            CPF,
            celular,
            email,
            Telefone_recado
        });
        return res.json(aluno);
    }
}
exports.UpdateAlunoController = UpdateAlunoController;
