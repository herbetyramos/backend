
import { Request, Response } from 'express';
import {ListServiceSegmentos} from "../../services/segmentos/ListServiceSegmentos";

class ListSegmentoController{
async handle(req:Request, res:Response){
  const listServiceSegmento = new ListServiceSegmentos();
  const segmento  = await listServiceSegmento.execute();

  return res.json(segmento);
}
}
export {ListSegmentoController};