"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProfessorController = void 0;
const DeleteServiceProfessores_1 = require("../../services/Professores/DeleteServiceProfessores");
class DeleteProfessorController {
    async handle(req, res) {
        try {
            const { id } = req.params;
            await new DeleteServiceProfessores_1.DeleteServiceProfessores().execute(id);
            return res.status(200).json({
                message: "Professor excluído com sucesso.",
            });
        }
        catch (error) {
            if (!(error instanceof Error)) {
                return res.status(500).json({
                    error: "Não foi possível excluir o professor.",
                });
            }
            if (error.message === "Professor não encontrado.") {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.startsWith("Não é possível excluir este professor")) {
                return res.status(409).json({ error: error.message });
            }
            console.error("Erro ao excluir professor:", error);
            return res.status(500).json({
                error: "Não foi possível excluir o professor.",
            });
        }
    }
}
exports.DeleteProfessorController = DeleteProfessorController;
