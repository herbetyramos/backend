"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMaterialController = void 0;
const CreateMaterialService_1 = require("../../../services/materiais/modules/CreateMaterialService");
class CreateMaterialController {
    async handle(req, res) {
        try {
            const { id_curso, propriedade, nome_material, qtde, } = req.body;
            const createMaterialService = new CreateMaterialService_1.CreateMaterialService();
            const material = await createMaterialService.execute({
                id_curso,
                propriedade: propriedade,
                nome_material,
                qtde: qtde ? Number(qtde) : undefined,
            });
            return res.status(201).json(material);
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
exports.CreateMaterialController = CreateMaterialController;
