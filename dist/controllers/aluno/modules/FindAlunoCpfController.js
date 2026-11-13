"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAlunoCpfController = void 0;
const FindAlunoCpfService_1 = require("../../../services/aluno/modules/FindAlunoCpfService");
class FindAlunoCpfController {
    async handle(req, res) {
        const { cpf } = req.params;
        const findAlunoCpfService = new FindAlunoCpfService_1.FindAlunoCpfService();
        const aluno = await findAlunoCpfService.execute(cpf);
        return res.json(aluno);
    }
}
exports.FindAlunoCpfController = FindAlunoCpfController;
