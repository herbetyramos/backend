"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAtaController = void 0;
const CreateServiceAta_1 = require("../../services/Ata/CreateServiceAta");
class CreateAtaController {
    async handle(req, res) {
        try {
            const { numero_ata, licitacao_id, id_empresa } = req.body;
            // -------------------------------
            // VALIDAR CAMPOS OBRIGATÓRIOS
            // -------------------------------
            if (!numero_ata || !licitacao_id || !id_empresa) {
                return res.status(400).json({
                    error: true,
                    message: "Preencha todos os campos obrigatórios.",
                });
            }
            const service = new CreateServiceAta_1.CreateServiceAta();
            const ata = await service.execute({
                numero_ata,
                licitacao_id,
                id_empresa
            });
            return res.status(201).json(ata); // criado com sucesso
        }
        catch (error) {
            console.error("Erro ao criar ata:", error);
            return res.status(500).json({
                error: true,
                message: "Erro ao criar ata.",
            });
        }
    }
}
exports.CreateAtaController = CreateAtaController;
