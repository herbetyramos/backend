import { Router } from "express";


import { CreateMatriculaController } 
from "../controllers/matricula/CreateMatriculaController";


import { ListMatriculaCronogramaController } 
from "../controllers/matricula/ListMatriculaCronogramaController";


import { DeleteMatriculaController } 
from "../controllers/matricula/DeleteMatriculaController";

import { UpdateMatriculaController }
from "../controllers/matricula/UpdateMatriculaController";

const matriculaRoutes = Router();

const updateMatriculaController =
  new UpdateMatriculaController();

const createMatriculaController =
  new CreateMatriculaController();


const listMatriculaCronogramaController =
  new ListMatriculaCronogramaController();


const deleteMatriculaController =
  new DeleteMatriculaController();





// Criar matrícula

matriculaRoutes.post(

  "/matricula",

  (req, res) =>

    createMatriculaController.handle(
      req,
      res
    )

);





// Buscar dados da turma

matriculaRoutes.get(

  "/matricula/cronograma/:id",

  (req, res) =>

    listMatriculaCronogramaController.handle(
      req,
      res
    )

);


// Atualizar matrícula

matriculaRoutes.put(

  "/matricula/:id",

  (req, res) =>

    updateMatriculaController.handle(
      req,
      res
    )

);


// Excluir matrícula

matriculaRoutes.delete(

  "/matricula/:id",

  (req, res) =>

    deleteMatriculaController.handle(
      req,
      res
    )

);





export {
  matriculaRoutes
};