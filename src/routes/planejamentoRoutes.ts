import {Router} from "express";

import {CreatePlanejamentoController} from "../controllers/planejamento/CreatePlanejamentoController";
import {ListPlanejamentoController} from "../controllers/planejamento/ListPlanejamentoController";
import {UpdatePlanejamentoController} from "../controllers/planejamento/UpdatePlanejamentoController";
import {DeletePlanejamentoController} from "../controllers/planejamento/DeletePlanejamentoController";
import { CreatePlanejamentoAutomaticoController } from "../controllers/planejamento/CreatePlanejamentoAutomaticoController";
import { SalvarTudoPlanejamentoController } from "../controllers/planejamento/SalvarTudoPlanejamentoController";
const planejamentoRoutes=Router();



planejamentoRoutes.post(
  "/gerar/:planeja_id",
  new CreatePlanejamentoAutomaticoController().handle
);

planejamentoRoutes.get(
  "/:planeja_id",
  new ListPlanejamentoController().handle
);

// PRIMEIRO a rota específica
planejamentoRoutes.put(
  "/salvar-tudo",
  new SalvarTudoPlanejamentoController().handle
);

// DEPOIS a rota dinâmica
planejamentoRoutes.put(
  "/:id",
  new UpdatePlanejamentoController().handle
);

planejamentoRoutes.delete(
  "/:id",
  new DeletePlanejamentoController().handle
);

export {planejamentoRoutes};