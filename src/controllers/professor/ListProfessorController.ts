import { Request, Response } from "express";
import {ListServiceProfessores} from '../../services/Professores/ListServiceProfessores';


class ListProfessorController{

  async handle(req:Request, res:Response){
    const service = new ListServiceProfessores();
    const professor = await service.execute();
    return res.json(professor);
  }}

export {ListProfessorController}