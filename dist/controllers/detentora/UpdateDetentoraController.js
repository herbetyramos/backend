"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDetentoraController = void 0;
const UpdateServiceDetentora_1 = require("../../services/Detentora/UpdateServiceDetentora");
class UpdateDetentoraController {
    async handle(req, res) {
        const { id } = req.params;
        const { ata_id, cursos_id, quantidade_turma, valor_curso, ativo, } = req.body;
        const service = new UpdateServiceDetentora_1.UpdateServiceDetentora();
        const detentora = await service.execute({
            id,
            ata_id,
            cursos_id,
            quantidade_turma,
            valor_curso,
            ativo,
        });
        return res.json(detentora);
    }
}
exports.UpdateDetentoraController = UpdateDetentoraController;
