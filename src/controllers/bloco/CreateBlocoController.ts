import { Request, Response } from "express";
import {CreateServiceBloco} from  '../../services/bloco/CreateServiceBloco'

class CreateBlocoController{
  async handle(req:Request, res:Response){
const {bloco_Curso} = req.body

const createBlocoController = new CreateServiceBloco();  
    
const bloco = await createBlocoController.execute({
      bloco_Curso });
      return res.json(bloco);      
  }
}

export {CreateBlocoController}