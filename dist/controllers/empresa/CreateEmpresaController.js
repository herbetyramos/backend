"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmpresaController = void 0;
const CreateServiceEmpresa_1 = require("../../services/empresa/CreateServiceEmpresa");
class CreateEmpresaController {
    async handle(req, res) {
        const { nome_empresa, telefone, representante, CNPJ } = req.body;
        const createEmpresaControle = new CreateServiceEmpresa_1.CreateServiceEmpresa();
        const empresa = await createEmpresaControle.execute({
            nome_empresa, telefone, representante, CNPJ
        });
        return res.json(empresa);
    }
}
exports.CreateEmpresaController = CreateEmpresaController;
