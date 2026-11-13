"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMaterialController = void 0;
const DeleteMaterialService_1 = require("../../../services/materiais/modules/DeleteMaterialService");
class DeleteMaterialController {
    async handle(req, res) {
        try {
            const { id } = req.params;
            const service = new DeleteMaterialService_1.DeleteMaterialService();
            const retorno = await service.execute(id);
            return res.json(retorno);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message
                });
            }
            return res.status(500).json({
                error: "Erro interno."
            });
        }
    }
}
exports.DeleteMaterialController = DeleteMaterialController;
