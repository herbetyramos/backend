"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAlunoController = void 0;
const CreateAlunoService_1 = require("../../services/aluno/CreateAlunoService");
class CreateAlunoController {
    async handle(req, res) {
        const { nome, CPF, celular, email, Telefone_recado } = req.body;
        const createAlunoService = new CreateAlunoService_1.CreateAlunoService();
        const aluno = await createAlunoService.execute({
            nome,
            CPF,
            celular,
            email,
            Telefone_recado
        });
        return res.status(201).json(aluno);
    }
}
exports.CreateAlunoController = CreateAlunoController;
