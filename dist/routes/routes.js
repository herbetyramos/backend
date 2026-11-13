"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multer_2 = require("../config/multer");
const routes_1 = require("../modules/aluno/routes");
const routes_2 = require("../modules/material/routes");
const routes_3 = require("../modules/matricula/routes");
const CreateUserController_1 = require("../controllers/users/CreateUserController");
const AuthUserController_1 = require("../controllers/users/AuthUserController");
const DetailUserController_1 = require("../controllers/users/DetailUserController");
const CreateSegmentoController_1 = require("../controllers/segmento/CreateSegmentoController");
const ListSegmentoController_1 = require("../controllers/segmento/ListSegmentoController");
const CreateCursosController_1 = require("../controllers/Cursos/CreateCursosController");
const ListCursosController_1 = require("../controllers/Cursos/ListCursosController");
const DeleteCronogramaController_1 = require("../controllers/delete/DeleteCronogramaController");
const ListProfessorController_1 = require("../controllers/professor/ListProfessorController");
const CreateProfessorController_1 = require("../controllers/professor/CreateProfessorController");
const CreateEmpresaController_1 = require("../controllers/empresa/CreateEmpresaController");
const ListEmpresaController_1 = require("../controllers/empresa/ListEmpresaController");
const CreateLocalController_1 = require("../controllers/local/CreateLocalController");
const ListLocalController_1 = require("../controllers/local/ListLocalController");
const CreateLicitacaoController_1 = require("../controllers/licitacao/CreateLicitacaoController");
const ListLicitacaoController_1 = require("../controllers/licitacao/ListLicitacaoController");
const CreateAtaController_1 = require("../controllers/ata/CreateAtaController");
const ListAtaController_1 = require("../controllers/ata/ListAtaController");
const CreateDententoraController_1 = require("../controllers/detentora/CreateDententoraController");
const ListDetentoraController_1 = require("../controllers/detentora/ListDetentoraController");
const GetSaldoDetentoraController_1 = require("../controllers/detentora/GetSaldoDetentoraController");
const GetRelatorioSaldoDetentoraController_1 = require("../controllers/detentora/GetRelatorioSaldoDetentoraController");
const UpdateDetentoraController_1 = require("../controllers/detentora/UpdateDetentoraController");
const CreateSalaController_1 = require("../controllers/sala/CreateSalaController");
const ListSalaController_1 = require("../controllers/sala/ListSalaController");
const CreateFormaturaController_1 = require("../controllers/formatura/CreateFormaturaController");
const ListFormaturaController_1 = require("../controllers/formatura/ListFormaturaController");
const CreateBlocoController_1 = require("../controllers/bloco/CreateBlocoController");
const ListBlocoController_1 = require("../controllers/bloco/ListBlocoController");
const CreateCronogramaController_1 = require("../controllers/cronograma/CreateCronogramaController");
const GetCronogramaController_1 = require("../controllers/cronograma/GetCronogramaController");
const UpdateCronogramaController_1 = require("../controllers/cronograma/UpdateCronogramaController");
const ListCronogramaController_1 = require("../controllers/listCronograma/ListCronogramaController");
const SendCronogramaController_1 = require("../controllers/email/SendCronogramaController");
const ListOfertaCursoController_1 = require("../controllers/OfertaCursos/ListOfertaCursoController");
const IsAuthenticated_1 = require("../middleware/IsAuthenticated");
const CreateAlunoController_1 = require("../controllers/aluno/CreateAlunoController");
const DeleteAlunoController_1 = require("../controllers/aluno/DeleteAlunoController");
const UpdateAlunoController_1 = require("../controllers/aluno/UpdateAlunoController");
const ListAlunoController_1 = require("../controllers/aluno/ListAlunoController");
const CreateMatriculaController_1 = require("../controllers/matricula/CreateMatriculaController");
const DeleteMatriculaController_1 = require("../controllers/matricula/DeleteMatriculaController");
const UpdateMatriculaController_1 = require("../controllers/matricula/UpdateMatriculaController");
const ListMatriculaController_1 = require("../controllers/matricula/ListMatriculaController");
const CreateMaterialController_1 = require("../controllers/materiais/CreateMaterialController");
const DeleteMaterialController_1 = require("../controllers/materiais/DeleteMaterialController");
const UpdateMaterialController_1 = require("../controllers/materiais/UpdateMaterialController");
const ListMaterialController_1 = require("../controllers/materiais/ListMaterialController");
const RelatorioDetentoraController_1 = require("../controllers/cronograma/RelatorioDetentoraController");
const planejamentoRoutes_1 = require("../routes/planejamentoRoutes");
const solicitacaoMaterialRoutes_1 = require("../modules/solicitacaoMaterial/solicitacaoMaterialRoutes");
const FindProfessorController_1 = require("../controllers/professor/FindProfessorController");
const UpdateProfessorController_1 = require("../controllers/professor/UpdateProfessorController");
const DeleteProfessorController_1 = require("../controllers/professor/DeleteProfessorController");
const routes_4 = require("../modules/certificado/routes");
const routes_5 = require("../modules/chat/routes");
const routes_6 = __importDefault(require("../whatsapp/routes"));
const routes_7 = require("../modules/bancoTalentos/routes");
const router = (0, express_1.Router)();
exports.router = router;
// =====================================================
// ROTAS DE MÓDULOS
// =====================================================
router.use(solicitacaoMaterialRoutes_1.solicitacaoMaterialRoutes);
router.use("/planejamento", planejamentoRoutes_1.planejamentoRoutes);
router.use("/certificado", routes_4.certificadoRoutes);
router.use("/chat", routes_5.chatRoutes);
router.use("/whatsapp", routes_6.default);
router.use(routes_7.bancoTalentosRoutes);
router.use(routes_1.alunoRoutes);
router.use(routes_2.materialRoutes);
router.use(routes_3.matriculaRoutes);
// =====================================================
// UPLOADS
// =====================================================
const uploadCurso = (0, multer_1.default)({
    dest: "uploads",
});
const uploadProfessor = (0, multer_1.default)({
    dest: "tmp/professor",
});
// =====================================================
// CONTROLLERS
// =====================================================
const sendCronogramaController = new SendCronogramaController_1.SendCronogramaController();
const deleteCronogramaController = new DeleteCronogramaController_1.DeleteCronogramaController();
const relatorioDetentoraController = new RelatorioDetentoraController_1.RelatorioDetentoraController();
const getSaldoDetentoraController = new GetSaldoDetentoraController_1.GetSaldoDetentoraController();
const getRelatorioSaldoDetentoraController = new GetRelatorioSaldoDetentoraController_1.GetRelatorioSaldoDetentoraController();
// =====================================================
// USUÁRIOS
// =====================================================
router.post("/users", new CreateUserController_1.CreateUserController().handle);
router.post("/session", new AuthUserController_1.AuthUserController().handle);
router.get("/me", IsAuthenticated_1.IsAuthenticated, new DetailUserController_1.DetailUserController().handle);
// =====================================================
// SEGMENTO
// =====================================================
router.post("/segmento", IsAuthenticated_1.IsAuthenticated, new CreateSegmentoController_1.CreateSegmentoController().handle);
router.get("/segmento", IsAuthenticated_1.IsAuthenticated, new ListSegmentoController_1.ListSegmentoController().handle);
// =====================================================
// CURSOS
// =====================================================
router.post("/cursos", IsAuthenticated_1.IsAuthenticated, uploadCurso.single("file"), new CreateCursosController_1.CreateCursosController().handle);
router.get("/cursos", IsAuthenticated_1.IsAuthenticated, new ListCursosController_1.ListCursosController().handle);
// =====================================================
// PROFESSORES
// =====================================================
router.post("/professor", IsAuthenticated_1.IsAuthenticated, uploadProfessor.single("file"), new CreateProfessorController_1.CreateProfessorController().handle);
router.get("/professor", IsAuthenticated_1.IsAuthenticated, new ListProfessorController_1.ListProfessorController().handle);
// =====================================================
// EMPRESAS
// =====================================================
router.post("/empresa", IsAuthenticated_1.IsAuthenticated, new CreateEmpresaController_1.CreateEmpresaController().handle);
router.get("/empresa", IsAuthenticated_1.IsAuthenticated, new ListEmpresaController_1.ListEmpresaController().handle);
// =====================================================
// LOCAL
// =====================================================
router.post("/local", IsAuthenticated_1.IsAuthenticated, new CreateLocalController_1.CreateLocalController().handle);
router.get("/local", IsAuthenticated_1.IsAuthenticated, new ListLocalController_1.ListLocalController().handle);
// =====================================================
// LICITAÇÃO
// =====================================================
router.post("/licitacao", IsAuthenticated_1.IsAuthenticated, new CreateLicitacaoController_1.CreateLicitacaoController().handle);
router.get("/licitacao", IsAuthenticated_1.IsAuthenticated, new ListLicitacaoController_1.ListLicitacaoController().handle);
// =====================================================
// ATA
// =====================================================
router.post("/ata", IsAuthenticated_1.IsAuthenticated, new CreateAtaController_1.CreateAtaController().handle);
router.get("/ata", IsAuthenticated_1.IsAuthenticated, new ListAtaController_1.ListAtaController().handle);
// =====================================================
// DETENTORA
// =====================================================
router.post("/detentora", IsAuthenticated_1.IsAuthenticated, new CreateDententoraController_1.CreateDetentoraController().handle);
router.put("/detentora/:id", IsAuthenticated_1.IsAuthenticated, new UpdateDetentoraController_1.UpdateDetentoraController().handle);
router.get("/detentora", IsAuthenticated_1.IsAuthenticated, new ListDetentoraController_1.ListDetentoraController().handle);
// Relatório antigo de detentora
router.get("/cronograma/relatorio-detentora", relatorioDetentoraController.handle);
// Saldo de uma detentora específica
router.get("/detentora/saldo", getSaldoDetentoraController.handle);
// NOVO RELATÓRIO DE SALDO
//
// Agrupado por empresa
//
// Empresa
//   Curso / Detentora
//   Total contratado
//   Total utilizado
//   Saldo atual
//
// + Total geral
router.get("/detentora/saldo-relatorio", IsAuthenticated_1.IsAuthenticated, getRelatorioSaldoDetentoraController.handle);
// =====================================================
// SALA
// =====================================================
router.post("/sala", IsAuthenticated_1.IsAuthenticated, new CreateSalaController_1.CreateSalaController().handle);
router.get("/sala", IsAuthenticated_1.IsAuthenticated, new ListSalaController_1.ListSalaController().handle);
// =====================================================
// FORMATURA
// =====================================================
router.post("/formatura", IsAuthenticated_1.IsAuthenticated, new CreateFormaturaController_1.CreateFormaturaController().handle);
router.get("/formatura", IsAuthenticated_1.IsAuthenticated, new ListFormaturaController_1.ListFormaturaController().handle);
// =====================================================
// BLOCO
// =====================================================
router.post("/bloco", IsAuthenticated_1.IsAuthenticated, new CreateBlocoController_1.CreateBlocoController().handle);
router.get("/bloco", IsAuthenticated_1.IsAuthenticated, new ListBlocoController_1.ListBlocoController().handle);
// =====================================================
// CRONOGRAMA
// =====================================================
router.post("/cronograma", IsAuthenticated_1.IsAuthenticated, multer_2.uploadCronograma.single("imagem"), new CreateCronogramaController_1.CreateCronogramaController().handle);
router.get("/listcronograma", IsAuthenticated_1.IsAuthenticated, new ListCronogramaController_1.ListCronogramaController().handle);
router.post("/sendemailcronograma", uploadCurso.single("file"), (req, res) => sendCronogramaController.handle(req, res));
router.get("/ofertacursos", new ListOfertaCursoController_1.ListOfertaCursoController().handle);
router.delete("/listcronograma/:id", new DeleteCronogramaController_1.DeleteCronogramaController().handle);
router.get("/cronograma/:id", new GetCronogramaController_1.GetCronogramaController().handle);
router.put("/cronograma/:id", new UpdateCronogramaController_1.UpdateCronogramaController().handle);
// =====================================================
// ALUNO
// =====================================================
router.post("/aluno", new CreateAlunoController_1.CreateAlunoController().handle);
router.get("/aluno", new ListAlunoController_1.ListAlunoController().handle);
router.put("/aluno", new UpdateAlunoController_1.UpdateAlunoController().handle);
router.delete("/aluno/:id", new DeleteAlunoController_1.DeleteAlunoController().handle);
// =====================================================
// MATRÍCULA
// =====================================================
router.post("/matricula", new CreateMatriculaController_1.CreateMatriculaController().handle);
router.get("/matricula", new ListMatriculaController_1.ListMatriculaController().handle);
router.put("/matricula/:id", new UpdateMatriculaController_1.UpdateMatriculaController().handle);
router.delete("/matricula/:id", new DeleteMatriculaController_1.DeleteMatriculaController().handle);
// =====================================================
// MATERIAIS
// =====================================================
router.post("/material", new CreateMaterialController_1.CreateMaterialController().handle);
router.get("/material", new ListMaterialController_1.ListMaterialController().handle);
router.put("/material", new UpdateMaterialController_1.UpdateMaterialController().handle);
router.delete("/material/:id", new DeleteMaterialController_1.DeleteMaterialController().handle);
// PROFESSORES
router.post("/professor", IsAuthenticated_1.IsAuthenticated, uploadProfessor.single("file"), new CreateProfessorController_1.CreateProfessorController().handle);
router.get("/professor", IsAuthenticated_1.IsAuthenticated, new ListProfessorController_1.ListProfessorController().handle);
router.get("/professor/:id", IsAuthenticated_1.IsAuthenticated, new FindProfessorController_1.FindProfessorController().handle);
router.put("/professor/:id", IsAuthenticated_1.IsAuthenticated, uploadProfessor.single("file"), new UpdateProfessorController_1.UpdateProfessorController().handle);
router.delete("/professor/:id", IsAuthenticated_1.IsAuthenticated, new DeleteProfessorController_1.DeleteProfessorController().handle);
