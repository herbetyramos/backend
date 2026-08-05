import { Router } from "express";

import { CreateAlunoController } from '../../controllers/aluno/CreateAlunoController';
import { DeleteAlunoController } from "../../controllers/aluno/DeleteAlunoController";
import { UpdateAlunoController } from "../../controllers/aluno/UpdateAlunoController";
import { ListAlunoController } from "../../controllers/aluno/ListAlunoController";
import { FindAlunoCpfController } from "../../controllers/aluno/modules/FindAlunoCpfController";


const alunoRoutes = Router();


const createAlunoController = new CreateAlunoController();
const listAlunoController = new ListAlunoController();
const findAlunoCpfController = new FindAlunoCpfController();
const updateAlunoController = new UpdateAlunoController();
const deleteAlunoController = new DeleteAlunoController();


/*** Criar aluno*/
alunoRoutes.post("/aluno", createAlunoController.handle);

/*** Listar alunos*/
alunoRoutes.get("/aluno", listAlunoController.handle);

/*** Buscar aluno por CPF*/
alunoRoutes.get("/aluno/cpf/:cpf", findAlunoCpfController.handle);

/*** Atualizar aluno*/
alunoRoutes.put("/aluno/:id", updateAlunoController.handle);

/*** Excluir aluno*/
alunoRoutes.delete("/aluno/:id", deleteAlunoController.handle);

export { alunoRoutes };



