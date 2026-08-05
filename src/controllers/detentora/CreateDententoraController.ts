import { Request, Response } from "express";
import {CreateServiceDetentora} from  '../../services/Detentora/CreateServiceDetentora'

class CreateDetentoraController{
  async handle(req:Request, res:Response){
const {ata_id, cursos_id, quantidade_turma} = req.body

const createDetentoraController = new CreateServiceDetentora();  
    
const detentora = await createDetentoraController.execute({
      ata_id, cursos_id, quantidade_turma, });
      return res.json(detentora);      
  }
}

export {CreateDetentoraController}