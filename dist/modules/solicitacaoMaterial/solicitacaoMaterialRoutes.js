"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solicitacaoMaterialRoutes = void 0;
const express_1 = require("express");
const CreateSolicitacaoMaterialController_1 = require("../../controllers/solicitacaoMaterial/CreateSolicitacaoMaterialController");
const ListSolicitacaoMaterialController_1 = require("../../controllers/solicitacaoMaterial/ListSolicitacaoMaterialController");
const UpdateSolicitacaoMaterialController_1 = require("../../controllers/solicitacaoMaterial/UpdateSolicitacaoMaterialController");
const DeleteSolicitacaoMaterialController_1 = require("../../controllers/solicitacaoMaterial/DeleteSolicitacaoMaterialController");
const ListMateriaisCronogramaController_1 = require("../../controllers/solicitacaoMaterial/ListMateriaisCronogramaController");
const solicitacaoMaterialRoutes = (0, express_1.Router)();
exports.solicitacaoMaterialRoutes = solicitacaoMaterialRoutes;
// Criar solicitação
solicitacaoMaterialRoutes.post("/solicitacao-material", new CreateSolicitacaoMaterialController_1.CreateSolicitacaoMaterialController().handle);
// Listar materiais do curso do cronograma
solicitacaoMaterialRoutes.get("/solicitacao-material/materiais", new ListMateriaisCronogramaController_1.ListMateriaisCronogramaController().handle);
// Listar solicitações do cronograma
solicitacaoMaterialRoutes.get("/solicitacao-material", new ListSolicitacaoMaterialController_1.ListSolicitacaoCronogramaController().handle);
// Atualizar solicitação
solicitacaoMaterialRoutes.put("/solicitacao-material/:id", new UpdateSolicitacaoMaterialController_1.UpdateSolicitacaoMaterialController().handle);
// Excluir solicitação
solicitacaoMaterialRoutes.delete("/solicitacao-material/:id", new DeleteSolicitacaoMaterialController_1.DeleteSolicitacaoMaterialController().handle);
