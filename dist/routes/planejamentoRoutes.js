"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planejamentoRoutes = void 0;
const express_1 = require("express");
const ListPlanejamentoController_1 = require("../controllers/planejamento/ListPlanejamentoController");
const UpdatePlanejamentoController_1 = require("../controllers/planejamento/UpdatePlanejamentoController");
const DeletePlanejamentoController_1 = require("../controllers/planejamento/DeletePlanejamentoController");
const CreatePlanejamentoAutomaticoController_1 = require("../controllers/planejamento/CreatePlanejamentoAutomaticoController");
const SalvarTudoPlanejamentoController_1 = require("../controllers/planejamento/SalvarTudoPlanejamentoController");
const planejamentoRoutes = (0, express_1.Router)();
exports.planejamentoRoutes = planejamentoRoutes;
planejamentoRoutes.post("/gerar/:planeja_id", new CreatePlanejamentoAutomaticoController_1.CreatePlanejamentoAutomaticoController().handle);
planejamentoRoutes.get("/:planeja_id", new ListPlanejamentoController_1.ListPlanejamentoController().handle);
// PRIMEIRO a rota específica
planejamentoRoutes.put("/salvar-tudo", new SalvarTudoPlanejamentoController_1.SalvarTudoPlanejamentoController().handle);
// DEPOIS a rota dinâmica
planejamentoRoutes.put("/:id", new UpdatePlanejamentoController_1.UpdatePlanejamentoController().handle);
planejamentoRoutes.delete("/:id", new DeletePlanejamentoController_1.DeletePlanejamentoController().handle);
