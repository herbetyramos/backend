"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMatriculaController = void 0;
const CreateMatriculaService_1 = require("../../services/matricula/CreateMatriculaService");
class CreateMatriculaController {
    async handle(req, res) {
        const { id_cronograma, id_aluno, confirmacao_curso, confirmacao_formatura, aprovado, justificativa } = req.body;
        const createMatriculaService = new CreateMatriculaService_1.CreateMatriculaService();
        try {
            const matricula = await createMatriculaService.execute({
                id_cronograma,
                id_aluno,
                confirmacao_curso,
                confirmacao_formatura,
                aprovado,
                justificativa
            });
            return res.status(201).json(matricula);
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
}
exports.CreateMatriculaController = CreateMatriculaController;
