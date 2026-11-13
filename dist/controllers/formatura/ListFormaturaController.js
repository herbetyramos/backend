"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListFormaturaController = void 0;
const ListServiceFormatura_1 = require("../../services/formatura/ListServiceFormatura");
class ListFormaturaController {
    async handle(req, res) {
        try {
            const listServiceFormatura = new ListServiceFormatura_1.ListServiceFormatura();
            const formatura = await listServiceFormatura.execute();
            return res.status(200).json(formatura); // ✔ sempre retorna JSON
        }
        catch (error) {
            console.error("Erro ao listar formatura:", error);
            return res.status(500).json({
                error: true,
                message: "Erro ao listar formatura",
            });
        }
    }
}
exports.ListFormaturaController = ListFormaturaController;
