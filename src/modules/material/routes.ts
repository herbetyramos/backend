import { Router } from "express";


import { CreateMaterialController } from '../../controllers/materiais/modules/CreateMaterialController';
import { DeleteMaterialController } from "../../controllers/materiais/modules/DeleteMaterialController";
import { UpdateMaterialController } from "../../controllers/materiais/modules/UpdateMaterialController";
import { ListMaterialController } from "../../controllers/materiais/modules/ListMaterialController";
import { ListMaterialCursoController } from "../../controllers/materiais/modules/ListMaterialCursoController";


const materialRoutes = Router();

const createMaterialController = new CreateMaterialController();
const listMaterialController = new ListMaterialController();
const listMaterialCursoController = new ListMaterialCursoController();
const updateMaterialController = new UpdateMaterialController();
const deleteMaterialController = new DeleteMaterialController();

/*** Criar material*/
materialRoutes.post("/material", createMaterialController.handle);

/*** Listar materiais*/
materialRoutes.get("/material", listMaterialController.handle);

/*** Listar materiais por curso * usado na matrícula */
materialRoutes.get("/material/curso/:id_curso", listMaterialCursoController.handle);

/*** Atualizar material*/
materialRoutes.put("/material/:id", updateMaterialController.handle);

/*** Excluir material*/
materialRoutes.delete("/material/:id", deleteMaterialController.handle);


export { materialRoutes };