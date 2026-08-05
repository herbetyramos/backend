import {Request,Response} from "express";
import {UpdatePlanejamentoService} from "../../services/planejamento/UpdatePlanejamentoService";

class UpdatePlanejamentoController{

    async handle(req:Request,res:Response){

        const{id}=req.params;

        const{
            conteudo
        }=req.body;

        const service=new UpdatePlanejamentoService();

        const result=await service.execute({
            id,
            conteudo
        });

        return res.json(result);

    }

}

export {UpdatePlanejamentoController}