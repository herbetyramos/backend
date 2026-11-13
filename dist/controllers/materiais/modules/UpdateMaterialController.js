"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaterialController = void 0;
const UpdateMaterialService_1 = require("../../../services/materiais/modules/UpdateMaterialService");
class UpdateMaterialController {
    async handle(req, res) {
        try {
            const { id } = req.params;
            const { propriedade, nome_material, qtde } = req.body;
            const service = new UpdateMaterialService_1.UpdateMaterialService();
            const material = await service.execute({
                id,
                propriedade: propriedade,
                nome_material,
                qtde: qtde ? Number(qtde) : undefined
            });
            return res.json(material);
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
exports.UpdateMaterialController = UpdateMaterialController;
