"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterialController = void 0;
const UpdateMaterialService_1 = require("../../services/materiais/UpdateMaterialService");
class UpdateMaterialController {
    async handle(req, res) {
        const { id } = req.params;
        const { propriedade, nome_material, qtde } = req.body;
        const service = new UpdateMaterialService_1.UpdateMaterialService();
        const material = await service.execute({
            id,
            propriedade,
            nome_material,
            qtde
        });
        return res.json(material);
    }
}
exports.UpdateMaterialController = UpdateMaterialController;
