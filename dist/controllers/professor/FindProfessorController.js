"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProfessorController = void 0;
const FindServiceProfessores_1 = require("../../services/Professores/FindServiceProfessores");
class FindProfessorController {
    async handle(req, res) {
        try {
            const professor = await new FindServiceProfessores_1.FindServiceProfessores().execute(req.params.id);
            return res.json(professor);
        }
        catch (error) {
            if (error instanceof Error &&
                error.message === "Professor não encontrado.") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Erro ao consultar professor:", error);
            return res.status(500).json({
                error: "Não foi possível consultar o professor.",
            });
        }
    }
}
exports.FindProfessorController = FindProfessorController;
