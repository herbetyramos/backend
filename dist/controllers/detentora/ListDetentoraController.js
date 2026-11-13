"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDetentoraController = void 0;
const ListServiceDetentora_1 = require("../../services/Detentora/ListServiceDetentora");
class ListDetentoraController {
    async handle(req, res) {
        const service = new ListServiceDetentora_1.ListServiceDetentora();
        const detentoras = await service.execute();
        return res.json(detentoras);
    }
}
exports.ListDetentoraController = ListDetentoraController;
