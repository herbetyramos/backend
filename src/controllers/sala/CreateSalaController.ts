import { Request, Response } from "express";
import {CreateServiceSala} from  '../../services/sala/CreateServiceSala'

class CreateSalaController{
  async handle(req:Request, res:Response){
const {numero_sala,tipo_uso,local_id} = req.body

const createSalaController = new CreateServiceSala();  
    
const sala = await createSalaController.execute({
      numero_sala,local_id,tipo_uso });
      return res.json(sala);      
  }
}

export {CreateSalaController}