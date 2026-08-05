
import { Request, Response } from 'express';
import {ListServiceSala} from "../../services/sala/ListServiceSala";

class ListSalaController{
async handle(req:Request, res:Response){
  const listServiceSala = new ListServiceSala();
  const salas  = await listServiceSala.execute();

  return res.json(salas);
}
}
export {ListSalaController};