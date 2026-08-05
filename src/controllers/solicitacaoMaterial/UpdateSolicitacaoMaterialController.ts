import {Request,Response} from "express";
import {UpdateSolicitacaoMaterialService} from "../../services/solicitacaoMaterial/UpdateSolicitacaoMaterialService";


class UpdateSolicitacaoMaterialController{


    async handle(req:Request,res:Response){


        const {
            id
        } = req.params;


        const {
            status
        } = req.body;



        const service = new UpdateSolicitacaoMaterialService();



        const solicitacao = await service.execute({

            id,
            status

        });



        return res.json(solicitacao);


    }


}


export {UpdateSolicitacaoMaterialController};