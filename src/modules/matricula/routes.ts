import { Router } from "express";

import { CreateMatriculaController } from "../../controllers/matricula/modules/CreateMatriculaController";
import { ListMatriculaController } from "../../controllers/matricula/ListMatriculaController";
import { ListMatriculaCronogramaController } from "../../controllers/matricula/ListMatriculaCronogramaController";
import { UpdateMatriculaController } from "../../controllers/matricula/UpdateMatriculaController";
import { DeleteMatriculaController } from "../../controllers/matricula/DeleteMatriculaController";

const matriculaRoutes = Router();

const createMatriculaController = new CreateMatriculaController();
const listMatriculaController = new ListMatriculaController();
const listMatriculaCronogramaController = new ListMatriculaCronogramaController();
const updateMatriculaController = new UpdateMatriculaController();
const deleteMatriculaController = new DeleteMatriculaController();

matriculaRoutes.post("/matricula", createMatriculaController.handle);
matriculaRoutes.get("/matricula", listMatriculaController.handle);
matriculaRoutes.get("/matricula/cronograma/:id_cronograma", listMatriculaCronogramaController.handle);
matriculaRoutes.put("/matricula/:id", updateMatriculaController.handle);
matriculaRoutes.delete("/matricula/:id", deleteMatriculaController.handle);



export { matriculaRoutes };