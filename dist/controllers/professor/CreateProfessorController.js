"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProfessorController = void 0;
const CreateServiceProfessores_1 = require("../../services/Professores/CreateServiceProfessores");
class CreateProfessorController {
    async handle(req, res) {
        const { nome_professor, telefone, Endereco, bairro, Numero, contato, CPF, especialidade, } = req.body;
        const foto = req.file?.filename || null;
        const createProfessorService = new CreateServiceProfessores_1.CreateServiceProfessores();
        const professor = await createProfessorService.execute({
            nome_professor,
            telefone,
            Endereco,
            bairro,
            Numero,
            contato,
            CPF,
            especialidade,
            foto,
        });
        return res.json(professor);
    }
}
exports.CreateProfessorController = CreateProfessorController;
