import {Router} from "express";

import {CreateMaterialController}
from "../controllers/materiais/modules/CreateMaterialController";

import {ListMaterialController}
from "../controllers/materiais/ListMaterialController";

import {UpdateMaterialController}
from "../controllers/materiais/modules/UpdateMaterialController";

import {DeleteMaterialController}
from "../controllers/materiais/modules/DeleteMaterialController";


const materialRoutes = Router();



materialRoutes.post(
"/material",
new CreateMaterialController().handle
);



materialRoutes.get(
"/material/curso/:id_curso",
new ListMaterialController().handle
);



materialRoutes.put(
"/material/:id",
new UpdateMaterialController().handle
);



materialRoutes.delete(
"/material/:id",
new DeleteMaterialController().handle
);



export {materialRoutes};