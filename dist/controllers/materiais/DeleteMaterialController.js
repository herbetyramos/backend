"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMaterialController = void 0;
const DeleteMaterialService_1 = require("../../services/materiais/DeleteMaterialService");
class DeleteMaterialController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new DeleteMaterialService_1.DeleteMaterialService();
        const resultado = await service.execute(id);
        return res.json(resultado);
    }
}
exports.DeleteMaterialController = DeleteMaterialController;
