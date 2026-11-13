"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfessorController = void 0;
const UpdateServiceProfessores_1 = require("../../services/Professores/UpdateServiceProfessores");
class UpdateProfessorController {
    async handle(req, res) {
        try {
            const { id } = req.params;
            const { nome_professor, telefone, Endereco, bairro, Numero, contato, CPF, especialidade, } = req.body;
            if (!nome_professor ||
                !telefone ||
                !Endereco ||
                !bairro ||
                !Numero ||
                !contato ||
                !CPF ||
                !especialidade) {
                return res.status(400).json({
                    error: "Preencha todos os campos obrigatórios.",
                });
            }
            const foto = req.file?.filename;
            const service = new UpdateServiceProfessores_1.UpdateServiceProfessores();
            const professor = await service.execute({
                id,
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
        catch (error) {
            if (error instanceof Error &&
                error.message === "Professor não encontrado.") {
                return res.status(404).json({ error: error.message });
            }
            console.error("Erro ao atualizar professor:", error);
            return res.status(500).json({
                error: "Não foi possível atualizar o professor.",
            });
        }
    }
}
exports.UpdateProfessorController = UpdateProfessorController;
