import { Request, Response } from "express";
import {CreateServiceFormatura} from  '../../services/formatura/CreateServiceFormatura'

class CreateFormaturaController{
  async handle(req:Request, res:Response){
const {data_formatura,local} = req.body

const createFormaturaController = new CreateServiceFormatura();  
    
const formatura = await createFormaturaController.execute({
      local,data_formatura});
      return res.json(formatura);      
  }
}

export {CreateFormaturaController}