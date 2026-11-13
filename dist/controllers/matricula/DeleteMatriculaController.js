"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatriculaController = void 0;
const DeleteMatriculaService_1 = require("../../services/matricula/DeleteMatriculaService");
class DeleteMatriculaController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new DeleteMatriculaService_1.DeleteMatriculaService();
        try {
            await service.execute(id);
            return res.json({
                message: "Matrícula excluída com sucesso."
            });
        }
        catch (error) {
            return res.status(400).json({
                error: error.message
            });
        }
    }
}
exports.DeleteMatriculaController = DeleteMatriculaController;
