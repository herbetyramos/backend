
import { Request, Response } from 'express';
import {ListServiceLocal} from "../../services/local/ListServiceLocal";

class ListLocalController{
async handle(req:Request, res:Response){
  const listServiceLocal = new ListServiceLocal();
  const local  = await listServiceLocal.execute();

  return res.json(local);
}
}
export {ListLocalController};