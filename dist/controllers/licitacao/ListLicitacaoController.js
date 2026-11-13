"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLicitacaoController = void 0;
const ListServiceLicitacao_1 = require("../../services/Licitacao/ListServiceLicitacao");
class ListLicitacaoController {
    async handle(req, res) {
        try {
            const listServiceLicitacao = new ListServiceLicitacao_1.ListServiceLicitacao();
            const licitacoes = await listServiceLicitacao.execute();
            return res.status(200).json(licitacoes); // ✔ sempre retorna JSON válido
        }
        catch (error) {
            console.error("Erro ao listar licitações:", error);
            return res.status(500).json({
                error: true,
                message: "Erro ao listar licitações",
            });
        }
    }
}
exports.ListLicitacaoController = ListLicitacaoController;
