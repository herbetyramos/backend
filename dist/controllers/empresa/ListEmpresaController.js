"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListEmpresaController = void 0;
const ListServiceEmpresa_1 = require("../../services/empresa/ListServiceEmpresa");
class ListEmpresaController {
    async handle(req, res) {
        try {
            const listServiceEmpresa = new ListServiceEmpresa_1.ListServiceEmpresa();
            const empresas = await listServiceEmpresa.execute();
            return res.status(200).json(empresas); // ✔ sempre retorna JSON
        }
        catch (error) {
            console.error("Erro ao listar empresas:", error);
            return res.status(500).json({
                error: true,
                message: "Erro ao listar empresas",
            });
        }
    }
}
exports.ListEmpresaController = ListEmpresaController;
