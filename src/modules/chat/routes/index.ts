import { Router } from "express";

import { CreateConversaController } from "../controllers/CreateConversaController";
import { ListConversasController } from "../controllers/ListConversasController";
import { ListMensagensController } from "../controllers/ListMensagensController";
import { EnviarMensagemController } from "../controllers/EnviarMensagemController";
import { ListAlunosCronogramaController } from "../controllers/ListAlunosCronogramaController";

const chatRoutes = Router();

const createConversaController = new CreateConversaController();
const listConversasController = new ListConversasController();
const listMensagensController = new ListMensagensController();
const enviarMensagemController = new EnviarMensagemController();
const listAlunosCronogramaController = new ListAlunosCronogramaController();

chatRoutes.post("/", createConversaController.handle);

chatRoutes.get("/", listConversasController.handle);


chatRoutes.get("/cronograma/:id", listAlunosCronogramaController.handle);


chatRoutes.get("/:id", listMensagensController.handle);


chatRoutes.post("/enviar", enviarMensagemController.handle);

export { chatRoutes };