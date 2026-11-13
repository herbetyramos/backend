"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSegmentoController = void 0;
const ListServiceSegmentos_1 = require("../../services/segmentos/ListServiceSegmentos");
class ListSegmentoController {
    async handle(req, res) {
        const listServiceSegmento = new ListServiceSegmentos_1.ListServiceSegmentos();
        const segmento = await listServiceSegmento.execute();
        return res.json(segmento);
    }
}
exports.ListSegmentoController = ListSegmentoController;
