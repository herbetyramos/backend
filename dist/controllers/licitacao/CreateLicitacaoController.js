"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLicitacaoController = void 0;
const CreateServiceLicitacao_1 = require("../../services/Licitacao/CreateServiceLicitacao");
class CreateLicitacaoController {
    async handle(req, res) {
        const { objeto, numero_licitacao } = req.body;
        const createLicitacaoController = new CreateServiceLicitacao_1.CreateServiceLicitacao();
        const licitacao = await createLicitacaoController.execute({
            objeto, numero_licitacao
        });
        return res.json(licitacao);
    }
}
exports.CreateLicitacaoController = CreateLicitacaoController;
