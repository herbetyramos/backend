"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alunoRoutes = void 0;
const express_1 = require("express");
const CreateAlunoController_1 = require("../../controllers/aluno/CreateAlunoController");
const DeleteAlunoController_1 = require("../../controllers/aluno/DeleteAlunoController");
const UpdateAlunoController_1 = require("../../controllers/aluno/UpdateAlunoController");
const ListAlunoController_1 = require("../../controllers/aluno/ListAlunoController");
const FindAlunoCpfController_1 = require("../../controllers/aluno/modules/FindAlunoCpfController");
const alunoRoutes = (0, express_1.Router)();
exports.alunoRoutes = alunoRoutes;
const createAlunoController = new CreateAlunoController_1.CreateAlunoController();
const listAlunoController = new ListAlunoController_1.ListAlunoController();
const findAlunoCpfController = new FindAlunoCpfController_1.FindAlunoCpfController();
const updateAlunoController = new UpdateAlunoController_1.UpdateAlunoController();
const deleteAlunoController = new DeleteAlunoController_1.DeleteAlunoController();
/*** Criar aluno*/
alunoRoutes.post("/aluno", createAlunoController.handle);
/*** Listar alunos*/
alunoRoutes.get("/aluno", listAlunoController.handle);
/*** Buscar aluno por CPF*/
alunoRoutes.get("/aluno/cpf/:cpf", findAlunoCpfController.handle);
/*** Atualizar aluno*/
alunoRoutes.put("/aluno/:id", updateAlunoController.handle);
/*** Excluir aluno*/
alunoRoutes.delete("/aluno/:id", deleteAlunoController.handle);
