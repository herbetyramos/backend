
import { Request, Response } from 'express';
import {ListServiceBloco} from "../../services/bloco/ListServiceBloco";

class ListBlocoController{
async handle(req:Request, res:Response){
  const listServiceBloco = new ListServiceBloco();
  const blocos  = await listServiceBloco.execute();

  return res.json(blocos);
}
}
export {ListBlocoController};