"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListProfessorController = void 0;
const ListServiceProfessores_1 = require("../../services/Professores/ListServiceProfessores");
class ListProfessorController {
    async handle(req, res) {
        const service = new ListServiceProfessores_1.ListServiceProfessores();
        const professor = await service.execute();
        return res.json(professor);
    }
}
exports.ListProfessorController = ListProfessorController;
