import { Request, Response } from "express";
import { UpdateMaterialService } from "../../services/materiais/UpdateMaterialService";


class UpdateMaterialController {


async handle(req:Request,res:Response){


const {id}=req.params;


const {
 propriedade,
 nome_material,
 qtde

}=req.body;



const service = new UpdateMaterialService();


const material = await service.execute({

id,
propriedade,
nome_material,
qtde

});


return res.json(material);


}


}


export { UpdateMaterialController };