import { Request, Response } from "express";
import {CreateServiceLicitacao} from  '../../services/Licitacao/CreateServiceLicitacao'

class CreateLicitacaoController{
  async handle(req:Request, res:Response){
const {objeto, numero_licitacao} = req.body

const createLicitacaoController = new CreateServiceLicitacao();  
    
const licitacao = await createLicitacaoController.execute({
      objeto, numero_licitacao });
      return res.json(licitacao);      
  }
}

export {CreateLicitacaoController}