import { Request, Response } from "express";
import {CreateServiceLocal} from  '../../services/local/CreateServiceLocal'

class CreateLocalController{
  async handle(req:Request, res:Response){
const {polo,Telefone, Telefone2} = req.body

const createLocalController = new CreateServiceLocal();  
    
const local = await createLocalController.execute({
      polo,Telefone, Telefone2});
      return res.json(local);      
  }
}

export {CreateLocalController}