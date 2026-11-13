"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDetentoraController = void 0;
const CreateServiceDetentora_1 = require("../../services/Detentora/CreateServiceDetentora");
class CreateDetentoraController {
    async handle(req, res) {
        const { ata_id, cursos_id, quantidade_turma, valor_curso = 0, ativo = true, } = req.body;
        const createDetentoraService = new CreateServiceDetentora_1.CreateServiceDetentora();
        const detentora = await createDetentoraService.execute({
            ata_id,
            cursos_id,
            quantidade_turma,
            valor_curso,
            ativo,
        });
        return res.json(detentora);
    }
}
exports.CreateDetentoraController = CreateDetentoraController;
