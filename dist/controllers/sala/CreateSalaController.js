"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSalaController = void 0;
const CreateServiceSala_1 = require("../../services/sala/CreateServiceSala");
class CreateSalaController {
    async handle(req, res) {
        const { numero_sala, tipo_uso, local_id } = req.body;
        const createSalaController = new CreateServiceSala_1.CreateServiceSala();
        const sala = await createSalaController.execute({
            numero_sala, local_id, tipo_uso
        });
        return res.json(sala);
    }
}
exports.CreateSalaController = CreateSalaController;
