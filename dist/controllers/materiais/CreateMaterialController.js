"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMaterialController = void 0;
const CreateMaterialService_1 = require("../../services/materiais/CreateMaterialService");
class CreateMaterialController {
    async handle(req, res) {
        const { id_curso, propriedade, nome_material, qtde } = req.body;
        const service = new CreateMaterialService_1.CreateMaterialService();
        const material = await service.execute({
            id_curso,
            propriedade,
            nome_material,
            qtde
        });
        return res.json(material);
    }
}
exports.CreateMaterialController = CreateMaterialController;
