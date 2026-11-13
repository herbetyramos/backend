"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const CreateConversaController_1 = require("../controllers/CreateConversaController");
const ListConversasController_1 = require("../controllers/ListConversasController");
const ListMensagensController_1 = require("../controllers/ListMensagensController");
const EnviarMensagemController_1 = require("../controllers/EnviarMensagemController");
const ListAlunosCronogramaController_1 = require("../controllers/ListAlunosCronogramaController");
const AtualizarStatusConversaController_1 = require("../controllers/AtualizarStatusConversaController");
const EditarMensagemController_1 = require("../controllers/EditarMensagemController");
const ApagarMensagemController_1 = require("../controllers/ApagarMensagemController");
const chatRoutes = (0, express_1.Router)();
exports.chatRoutes = chatRoutes;
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
const createConversaController = new CreateConversaController_1.CreateConversaController();
const listConversasController = new ListConversasController_1.ListConversasController();
const listMensagensController = new ListMensagensController_1.ListMensagensController();
const enviarMensagemController = new EnviarMensagemController_1.EnviarMensagemController();
const listAlunosCronogramaController = new ListAlunosCronogramaController_1.ListAlunosCronogramaController();
const atualizarStatusConversaController = new AtualizarStatusConversaController_1.AtualizarStatusConversaController();
const editarMensagemController = new EditarMensagemController_1.EditarMensagemController();
const apagarMensagemController = new ApagarMensagemController_1.ApagarMensagemController();
chatRoutes.post("/", createConversaController.handle);
chatRoutes.get("/", listConversasController.handle);
chatRoutes.get("/cronograma/:id", listAlunosCronogramaController.handle);
chatRoutes.patch("/:conversaId/status", atualizarStatusConversaController.handle);
chatRoutes.get("/:id", listMensagensController.handle);
chatRoutes.post("/enviar", upload.single("arquivo"), enviarMensagemController.handle);
// Editar mensagem
chatRoutes.patch("/mensagem/:mensagemId", editarMensagemController.handle);
// Apagar mensagem
chatRoutes.delete("/mensagem/:mensagemId", apagarMensagemController.handle);
