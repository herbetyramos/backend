"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConversaController = void 0;
const CreateConversaService_1 = require("../services/CreateConversaService");
class CreateConversaController {
    async handle(req, res) {
        const { telefone, nome, aluno_id, professor_id, } = req.body;
        const service = new CreateConversaService_1.CreateConversaService();
        const conversa = await service.execute({
            telefone,
            nome,
            aluno_id,
            professor_id,
        });
        return res.json(conversa);
    }
}
exports.CreateConversaController = CreateConversaController;
