import {Request,Response} from "express";
import {ListPlanejamentoService} from "../../services/planejamento/ListPlanejamentoService";

class ListPlanejamentoController{

    async handle(req:Request,res:Response){

        const {planeja_id}=req.params;

        const service=new ListPlanejamentoService();

        const lista=await service.execute(planeja_id);

        return res.json(lista);

    }

}

export {ListPlanejamentoController}