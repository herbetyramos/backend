import { Router } from "express";
import multer from "multer";

import { uploadCronograma } from "../config/multer";


import { alunoRoutes } from "../modules/aluno/routes";
import { materialRoutes } from "../modules/material/routes";
import { matriculaRoutes } from "../modules/matricula/routes";

import { CreateUserController } from "../controllers/users/CreateUserController";
import { AuthUserController } from "../controllers/users/AuthUserController";
import { DetailUserController } from "../controllers/users/DetailUserController";

import { CreateSegmentoController } from "../controllers/segmento/CreateSegmentoController";
import { ListSegmentoController } from "../controllers/segmento/ListSegmentoController";

import { CreateCursosController } from "../controllers/Cursos/CreateCursosController";
import { ListCursosController } from "../controllers/Cursos/ListCursosController";

import { DeleteCronogramaController } from "../controllers/delete/DeleteCronogramaController";

import { ListProfessorController } from "../controllers/professor/ListProfessorController";
import { CreateProfessorController } from "../controllers/professor/CreateProfessorController";

import { CreateEmpresaController } from "../controllers/empresa/CreateEmpresaController";
import { ListEmpresaController } from "../controllers/empresa/ListEmpresaController";

import { CreateLocalController } from "../controllers/local/CreateLocalController";
import { ListLocalController } from "../controllers/local/ListLocalController";

import { CreateLicitacaoController } from "../controllers/licitacao/CreateLicitacaoController";
import { ListLicitacaoController } from "../controllers/licitacao/ListLicitacaoController";

import { CreateAtaController } from "../controllers/ata/CreateAtaController";
import { ListAtaController } from "../controllers/ata/ListAtaController";

import { CreateDetentoraController } from "../controllers/detentora/CreateDententoraController";
import { ListDetentoraController } from "../controllers/detentora/ListDetentoraController";

import { GetSaldoDetentoraController } from "../controllers/detentora/GetSaldoDetentoraController";
import { GetRelatorioSaldoDetentoraController } from "../controllers/detentora/GetRelatorioSaldoDetentoraController";

import { CreateSalaController } from "../controllers/sala/CreateSalaController";
import { ListSalaController } from "../controllers/sala/ListSalaController";

import { CreateFormaturaController } from "../controllers/formatura/CreateFormaturaController";
import { ListFormaturaController } from "../controllers/formatura/ListFormaturaController";

import { CreateBlocoController } from "../controllers/bloco/CreateBlocoController";
import { ListBlocoController } from "../controllers/bloco/ListBlocoController";

import { CreateCronogramaController } from "../controllers/cronograma/CreateCronogramaController";
import { GetCronogramaController } from "../controllers/cronograma/GetCronogramaController";
import { UpdateCronogramaController } from "../controllers/cronograma/UpdateCronogramaController";

import { ListCronogramaController } from "../controllers/listCronograma/ListCronogramaController";

import { SendCronogramaController } from "../controllers/email/SendCronogramaController";

import { ListOfertaCursoController } from "../controllers/OfertaCursos/ListOfertaCursoController";

import { IsAuthenticated } from "../middleware/IsAuthenticated";

import { CreateAlunoController } from "../controllers/aluno/CreateAlunoController";
import { DeleteAlunoController } from "../controllers/aluno/DeleteAlunoController";
import { UpdateAlunoController } from "../controllers/aluno/UpdateAlunoController";
import { ListAlunoController } from "../controllers/aluno/ListAlunoController";

import { CreateMatriculaController } from "../controllers/matricula/CreateMatriculaController";
import { DeleteMatriculaController } from "../controllers/matricula/DeleteMatriculaController";
import { UpdateMatriculaController } from "../controllers/matricula/UpdateMatriculaController";
import { ListMatriculaController } from "../controllers/matricula/ListMatriculaController";

import { CreateMaterialController } from "../controllers/materiais/CreateMaterialController";
import { DeleteMaterialController } from "../controllers/materiais/DeleteMaterialController";
import { UpdateMaterialController } from "../controllers/materiais/UpdateMaterialController";
import { ListMaterialController } from "../controllers/materiais/ListMaterialController";

import { RelatorioDetentoraController } from "../controllers/cronograma/RelatorioDetentoraController";

import { planejamentoRoutes } from "../routes/planejamentoRoutes";

import { solicitacaoMaterialRoutes } from "../modules/solicitacaoMaterial/solicitacaoMaterialRoutes";

import { certificadoRoutes } from "../modules/certificado/routes";
import { chatRoutes } from "../modules/chat/routes";

import whatsappRoutes from "../whatsapp/routes";


const router = Router();


// =====================================================
// ROTAS DE MÓDULOS
// =====================================================

router.use(solicitacaoMaterialRoutes);

router.use("/planejamento", planejamentoRoutes);

router.use("/certificado", certificadoRoutes);

router.use("/chat", chatRoutes);

router.use("/whatsapp", whatsappRoutes);

router.use(alunoRoutes);

router.use(materialRoutes);

router.use(matriculaRoutes);


// =====================================================
// UPLOADS
// =====================================================

const uploadCurso = multer({
  dest: "uploads",
});

const uploadProfessor = multer({
  dest: "tmp/professor",
});


// =====================================================
// CONTROLLERS
// =====================================================

const sendCronogramaController =
  new SendCronogramaController();

const deleteCronogramaController =
  new DeleteCronogramaController();

const relatorioDetentoraController =
  new RelatorioDetentoraController();

const getSaldoDetentoraController =
  new GetSaldoDetentoraController();

const getRelatorioSaldoDetentoraController =
  new GetRelatorioSaldoDetentoraController();


// =====================================================
// USUÁRIOS
// =====================================================

router.post(
  "/users",
  new CreateUserController().handle
);

router.post(
  "/session",
  new AuthUserController().handle
);

router.get(
  "/me",
  IsAuthenticated,
  new DetailUserController().handle
);


// =====================================================
// SEGMENTO
// =====================================================

router.post(
  "/segmento",
  IsAuthenticated,
  new CreateSegmentoController().handle
);

router.get(
  "/segmento",
  IsAuthenticated,
  new ListSegmentoController().handle
);


// =====================================================
// CURSOS
// =====================================================

router.post(
  "/cursos",
  IsAuthenticated,
  uploadCurso.single("file"),
  new CreateCursosController().handle
);

router.get(
  "/cursos",
  IsAuthenticated,
  new ListCursosController().handle
);


// =====================================================
// PROFESSORES
// =====================================================

router.post(
  "/professor",
  IsAuthenticated,
  uploadProfessor.single("file"),
  new CreateProfessorController().handle
);

router.get(
  "/professor",
  IsAuthenticated,
  new ListProfessorController().handle
);


// =====================================================
// EMPRESAS
// =====================================================

router.post(
  "/empresa",
  IsAuthenticated,
  new CreateEmpresaController().handle
);

router.get(
  "/empresa",
  IsAuthenticated,
  new ListEmpresaController().handle
);


// =====================================================
// LOCAL
// =====================================================

router.post(
  "/local",
  IsAuthenticated,
  new CreateLocalController().handle
);

router.get(
  "/local",
  IsAuthenticated,
  new ListLocalController().handle
);


// =====================================================
// LICITAÇÃO
// =====================================================

router.post(
  "/licitacao",
  IsAuthenticated,
  new CreateLicitacaoController().handle
);

router.get(
  "/licitacao",
  IsAuthenticated,
  new ListLicitacaoController().handle
);


// =====================================================
// ATA
// =====================================================

router.post(
  "/ata",
  IsAuthenticated,
  new CreateAtaController().handle
);

router.get(
  "/ata",
  IsAuthenticated,
  new ListAtaController().handle
);


// =====================================================
// DETENTORA
// =====================================================

router.post(
  "/detentora",
  IsAuthenticated,
  new CreateDetentoraController().handle
);




router.get(
  "/detentora",
  IsAuthenticated,
  new ListDetentoraController().handle
);


// Relatório antigo de detentora

router.get(
  "/cronograma/relatorio-detentora",
  relatorioDetentoraController.handle
);


// Saldo de uma detentora específica

router.get(
  "/detentora/saldo",
  getSaldoDetentoraController.handle
);


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

router.get(
  "/detentora/saldo-relatorio",
  IsAuthenticated,
  getRelatorioSaldoDetentoraController.handle
);


// =====================================================
// SALA
// =====================================================

router.post(
  "/sala",
  IsAuthenticated,
  new CreateSalaController().handle
);

router.get(
  "/sala",
  IsAuthenticated,
  new ListSalaController().handle
);


// =====================================================
// FORMATURA
// =====================================================

router.post(
  "/formatura",
  IsAuthenticated,
  new CreateFormaturaController().handle
);

router.get(
  "/formatura",
  IsAuthenticated,
  new ListFormaturaController().handle
);


// =====================================================
// BLOCO
// =====================================================

router.post(
  "/bloco",
  IsAuthenticated,
  new CreateBlocoController().handle
);

router.get(
  "/bloco",
  IsAuthenticated,
  new ListBlocoController().handle
);


// =====================================================
// CRONOGRAMA
// =====================================================

router.post(
  "/cronograma",
  IsAuthenticated,
  uploadCronograma.single("imagem"),
  new CreateCronogramaController().handle
);

router.get(
  "/listcronograma",
  IsAuthenticated,
  new ListCronogramaController().handle
);

router.post(
  "/sendemailcronograma",
  uploadCurso.single("file"),
  (req, res) =>
    sendCronogramaController.handle(req, res)
);

router.get(
  "/ofertacursos",
  new ListOfertaCursoController().handle
);

router.delete(
  "/listcronograma/:id",
  new DeleteCronogramaController().handle
);

router.get(
  "/cronograma/:id",
  new GetCronogramaController().handle
);

router.put(
  "/cronograma/:id",
  new UpdateCronogramaController().handle
);


// =====================================================
// ALUNO
// =====================================================

router.post(
  "/aluno",
  new CreateAlunoController().handle
);

router.get(
  "/aluno",
  new ListAlunoController().handle
);

router.put(
  "/aluno",
  new UpdateAlunoController().handle
);

router.delete(
  "/aluno/:id",
  new DeleteAlunoController().handle
);


// =====================================================
// MATRÍCULA
// =====================================================

router.post(
  "/matricula",
  new CreateMatriculaController().handle
);

router.get(
  "/matricula",
  new ListMatriculaController().handle
);

router.put(
  "/matricula/:id",
  new UpdateMatriculaController().handle
);

router.delete(
  "/matricula/:id",
  new DeleteMatriculaController().handle
);


// =====================================================
// MATERIAIS
// =====================================================

router.post(
  "/material",
  new CreateMaterialController().handle
);

router.get(
  "/material",
  new ListMaterialController().handle
);

router.put(
  "/material",
  new UpdateMaterialController().handle
);

router.delete(
  "/material/:id",
  new DeleteMaterialController().handle
);


export { router };