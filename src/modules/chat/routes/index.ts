import { Router } from "express";
import multer from "multer";

import { CreateConversaController } from "../controllers/CreateConversaController";
import { ListConversasController } from "../controllers/ListConversasController";
import { ListMensagensController } from "../controllers/ListMensagensController";
import { EnviarMensagemController } from "../controllers/EnviarMensagemController";
import { ListAlunosCronogramaController } from "../controllers/ListAlunosCronogramaController";
import { AtualizarStatusConversaController } from "../controllers/AtualizarStatusConversaController";
import { EditarMensagemController } from "../controllers/EditarMensagemController";
import { ApagarMensagemController } from "../controllers/ApagarMensagemController";

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

// Editar mensagem
chatRoutes.patch(
  "/mensagem/:mensagemId",
  editarMensagemController.handle
);

// Apagar mensagem
chatRoutes.delete(
  "/mensagem/:mensagemId",
  apagarMensagemController.handle
);

export { chatRoutes };