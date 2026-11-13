
import { Router } from "express";
import multer from "multer";

import { IsAuthenticated } from "../../../middleware/IsAuthenticated";

import { CreateConversaController } from "../controllers/CreateConversaController";
import { ListConversasController } from "../controllers/ListConversasController";
import { ListMensagensController } from "../controllers/ListMensagensController";
import { EnviarMensagemController } from "../controllers/EnviarMensagemController";
import { ListAlunosCronogramaController } from "../controllers/ListAlunosCronogramaController";
import { AtualizarStatusConversaController } from "../controllers/AtualizarStatusConversaController";
import { EditarMensagemController } from "../controllers/EditarMensagemController";
import { ApagarMensagemController } from "../controllers/ApagarMensagemController";
import { ProfessoresChatController } from "../controllers/ProfessoresChatController";

const chatRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const createConversaController =
  new CreateConversaController();

const listConversasController =
  new ListConversasController();

const listMensagensController =
  new ListMensagensController();

const enviarMensagemController =
  new EnviarMensagemController();

const listAlunosCronogramaController =
  new ListAlunosCronogramaController();

const atualizarStatusConversaController =
  new AtualizarStatusConversaController();

const editarMensagemController =
  new EditarMensagemController();

const apagarMensagemController =
  new ApagarMensagemController();

const professoresChatController =
  new ProfessoresChatController();

// ============================================================
// PROFESSORES DO BLOCO
// ============================================================

chatRoutes.get(
  "/professores/cronograma/:id",
  IsAuthenticated,
  professoresChatController.listar.bind(
    professoresChatController
  )
);

chatRoutes.post(
  "/professores/enviar",
  IsAuthenticated,
  upload.single("arquivo"),
  professoresChatController.enviar.bind(
    professoresChatController
  )
);

// ============================================================
// CONVERSAS
// ============================================================

chatRoutes.post(
  "/",
  createConversaController.handle
);

chatRoutes.get(
  "/",
  listConversasController.handle
);

chatRoutes.get(
  "/cronograma/:id",
  listAlunosCronogramaController.handle
);

chatRoutes.patch(
  "/:conversaId/status",
  atualizarStatusConversaController.handle
);

chatRoutes.get(
  "/:id",
  listMensagensController.handle
);

chatRoutes.post(
  "/enviar",
  upload.single("arquivo"),
  enviarMensagemController.handle
);

// ============================================================
// EDITAR E APAGAR MENSAGENS
// ============================================================

chatRoutes.patch(
  "/mensagem/:mensagemId",
  editarMensagemController.handle
);

chatRoutes.delete(
  "/mensagem/:mensagemId",
  apagarMensagemController.handle
);

export { chatRoutes };
