import { Request, Response } from "express";
import { CreateMaterialService } from "../../services/materiais/CreateMaterialService";


class CreateMaterialController {


async handle(req:Request,res:Response){


const {
 id_curso,
 propriedade,
 nome_material,
 qtde

}=req.body;



const service = new CreateMaterialService();


const material = await service.execute({

id_curso,
propriedade,
nome_material,
qtde

});


return res.json(material);


}


}


export {CreateMaterialController};