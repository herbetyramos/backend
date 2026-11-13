"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaterialCursoController = void 0;
const ListMaterialCursoService_1 = require("../../../services/materiais/modules/ListMaterialCursoService");
class ListMaterialCursoController {
    async handle(req, res) {
        try {
            const { id_curso } = req.params;
            const service = new ListMaterialCursoService_1.ListMaterialCursoService();
            const materiais = await service.execute(id_curso);
            return res.json(materiais);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message,
                });
            }
            return res.status(500).json({
                error: "Erro interno do servidor.",
            });
        }
    }
}
exports.ListMaterialCursoController = ListMaterialCursoController;
