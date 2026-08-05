import {Request,Response} from "express";
import {DeletePlanejamentoService} from "../../services/planejamento/DeletePlanejamentoService";

class DeletePlanejamentoController{

    async handle(req:Request,res:Response){

        const{id}=req.params;

        const service=new DeletePlanejamentoService();

        const result=await service.execute(id);

        return res.json(result);

    }

}

export {DeletePlanejamentoController}