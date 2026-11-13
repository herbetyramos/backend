"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificadoController = void 0;
const CertificadoService_1 = require("../../services/certificado/CertificadoService");
class CertificadoController {
    async handle(req, res) {
        const { id } = req.params;
        const service = new CertificadoService_1.CertificadoService();
        const alunos = await service.execute(id);
        return res.json(alunos);
    }
}
exports.CertificadoController = CertificadoController;
