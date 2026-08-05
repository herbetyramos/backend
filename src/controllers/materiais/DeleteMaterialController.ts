import { Request, Response } from "express";
import { DeleteMaterialService } from "../../services/materiais/DeleteMaterialService";


class DeleteMaterialController {


async handle(req:Request,res:Response){


const {id}=req.params;


const service = new DeleteMaterialService();


const resultado = await service.execute(id);



return res.json(resultado);


}


}


export { DeleteMaterialController };