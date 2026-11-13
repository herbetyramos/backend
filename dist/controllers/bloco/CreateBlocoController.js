"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBlocoController = void 0;
const CreateServiceBloco_1 = require("../../services/bloco/CreateServiceBloco");
class CreateBlocoController {
    async handle(req, res) {
        const { bloco_Curso } = req.body;
        const createBlocoController = new CreateServiceBloco_1.CreateServiceBloco();
        const bloco = await createBlocoController.execute({
            bloco_Curso
        });
        return res.json(bloco);
    }
}
exports.CreateBlocoController = CreateBlocoController;
