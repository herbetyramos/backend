"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMatriculaController = void 0;
const CreateMatriculaService_1 = require("../../../services/matricula/modules/CreateMatriculaService");
class CreateMatriculaController {
    async handle(req, res) {
        try {
            const { id_cronograma, id_aluno, confirmacao_curso, confirmacao_formatura, aprovado, justificativa } = req.body;
            const service = new CreateMatriculaService_1.CreateMatriculaService();
            const matricula = await service.execute({
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
            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message
                });
            }
            return res.status(500).json({
                error: "Erro interno do servidor."
            });
        }
    }
}
exports.CreateMatriculaController = CreateMatriculaController;
