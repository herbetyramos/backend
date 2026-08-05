import { Request, Response } from "express";
import {CreateCursosService} from  '../../services/cursos/CreateCursosService'


class CreateCursosController{
  async handle(req:Request, res:Response){
    const {nome_curso, price, description, segmento_id} = req.body

const createCursosService = new CreateCursosService();

   if(!req.file){
    throw new Error("error upload file")
   }else{
    const {originalname,filename:banner} = req.file;

    const cursos = await createCursosService.execute({
      nome_curso, 
      price, 
      description, 
      segmento_id, 
      banner,});

      return res.json(cursos);
   }
  
    
  }
}

export {CreateCursosController}