"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matriculaRoutes = void 0;
const express_1 = require("express");
const CreateMatriculaController_1 = require("../controllers/matricula/CreateMatriculaController");
const ListMatriculaCronogramaController_1 = require("../controllers/matricula/ListMatriculaCronogramaController");
const DeleteMatriculaController_1 = require("../controllers/matricula/DeleteMatriculaController");
const UpdateMatriculaController_1 = require("../controllers/matricula/UpdateMatriculaController");
const matriculaRoutes = (0, express_1.Router)();
exports.matriculaRoutes = matriculaRoutes;
const updateMatriculaController = new UpdateMatriculaController_1.UpdateMatriculaController();
const createMatriculaController = new CreateMatriculaController_1.CreateMatriculaController();
const listMatriculaCronogramaController = new ListMatriculaCronogramaController_1.ListMatriculaCronogramaController();
const deleteMatriculaController = new DeleteMatriculaController_1.DeleteMatriculaController();
// Criar matrícula
matriculaRoutes.post("/matricula", (req, res) => createMatriculaController.handle(req, res));
// Buscar dados da turma
matriculaRoutes.get("/matricula/cronograma/:id", (req, res) => listMatriculaCronogramaController.handle(req, res));
// Atualizar matrícula
matriculaRoutes.put("/matricula/:id", (req, res) => updateMatriculaController.handle(req, res));
// Excluir matrícula
matriculaRoutes.delete("/matricula/:id", (req, res) => deleteMatriculaController.handle(req, res));
