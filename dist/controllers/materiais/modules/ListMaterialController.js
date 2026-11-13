"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaterialController = void 0;
const ListMaterialService_1 = require("../../../services/materiais/modules/ListMaterialService");
class ListMaterialController {
    async handle(req, res) {
        try {
            const service = new ListMaterialService_1.ListMaterialService();
            const materiais = await service.execute();
            return res.json(materiais);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    error: error.message,
                });
            }
            return res.status(500).json({
                error: "Erro interno do servidor."
            });
        }
    }
}
exports.ListMaterialController = ListMaterialController;
