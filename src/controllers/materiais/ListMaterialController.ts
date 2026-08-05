import { Request, Response } from "express";
import { ListMaterialService } from "../../services/materiais/ListMaterialService";


class ListMaterialController {


async handle(req:Request,res:Response){


const { id_curso } = req.params;


const service = new ListMaterialService();


const materiais = await service.execute(id_curso);


return res.json(materiais);


}


}


export { ListMaterialController };