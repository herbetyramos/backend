"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialRoutes = void 0;
const express_1 = require("express");
const CreateMaterialController_1 = require("../../controllers/materiais/modules/CreateMaterialController");
const DeleteMaterialController_1 = require("../../controllers/materiais/modules/DeleteMaterialController");
const UpdateMaterialController_1 = require("../../controllers/materiais/modules/UpdateMaterialController");
const ListMaterialController_1 = require("../../controllers/materiais/modules/ListMaterialController");
const ListMaterialCursoController_1 = require("../../controllers/materiais/modules/ListMaterialCursoController");
const materialRoutes = (0, express_1.Router)();
exports.materialRoutes = materialRoutes;
const createMaterialController = new CreateMaterialController_1.CreateMaterialController();
const listMaterialController = new ListMaterialController_1.ListMaterialController();
const listMaterialCursoController = new ListMaterialCursoController_1.ListMaterialCursoController();
const updateMaterialController = new UpdateMaterialController_1.UpdateMaterialController();
const deleteMaterialController = new DeleteMaterialController_1.DeleteMaterialController();
/*** Criar material*/
materialRoutes.post("/material", createMaterialController.handle);
/*** Listar materiais*/
materialRoutes.get("/material", listMaterialController.handle);
/*** Listar materiais por curso * usado na matrícula */
materialRoutes.get("/material/curso/:id_curso", listMaterialCursoController.handle);
/*** Atualizar material*/
materialRoutes.put("/material/:id", updateMaterialController.handle);
/*** Excluir material*/
materialRoutes.delete("/material/:id", deleteMaterialController.handle);
