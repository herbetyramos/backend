"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMatriculaCronogramaController = void 0;
const ListMatriculaCronogramaService_1 = require("../../services/matricula/ListMatriculaCronogramaService");
class ListMatriculaCronogramaController {
    async handle(req, res) {
        console.log("================================");
        console.log("URL:", req.originalUrl);
        console.log("Params:", req.params);
        const id = req.params.id ??
            req.params.id_cronograma;
        console.log("ID recebido:", id);
        const service = new ListMatriculaCronogramaService_1.ListMatriculaCronogramaService();
        try {
            const dados = await service.execute(id);
            return res.json(dados);
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({
                error: error.message
            });
        }
    }
}
exports.ListMatriculaCronogramaController = ListMatriculaCronogramaController;
