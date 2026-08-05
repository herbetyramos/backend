import {Request,Response} from "express";
import {DeleteSolicitacaoMaterialService} from "../../services/solicitacaoMaterial/DeleteSolicitacaoMaterialService";


class DeleteSolicitacaoMaterialController{


    async handle(req:Request,res:Response){


        const {
            id
        } = req.params;



        const service = new DeleteSolicitacaoMaterialService();



        const resultado = await service.execute(id);



        return res.json(resultado);


    }


}


export {DeleteSolicitacaoMaterialController};