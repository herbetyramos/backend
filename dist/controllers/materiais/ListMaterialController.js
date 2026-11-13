"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaterialController = void 0;
const ListMaterialService_1 = require("../../services/materiais/ListMaterialService");
class ListMaterialController {
    async handle(req, res) {
        const { id_curso } = req.params;
        const service = new ListMaterialService_1.ListMaterialService();
        const materiais = await service.execute(id_curso);
        return res.json(materiais);
    }
}
exports.ListMaterialController = ListMaterialController;
