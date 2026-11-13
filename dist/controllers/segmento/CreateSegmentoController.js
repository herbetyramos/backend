"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSegmentoController = void 0;
const CreateServiceSegmentos_1 = require("../../services/segmentos/CreateServiceSegmentos");
class CreateSegmentoController {
    async handle(req, res) {
        const { name } = req.body;
        const createServiceSegmentos = new CreateServiceSegmentos_1.CreateServiceSegmentos();
        const segmento = await createServiceSegmentos.execute({
            name
        });
        return res.json(segmento);
    }
}
exports.CreateSegmentoController = CreateSegmentoController;
