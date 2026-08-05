import { Request, Response } from "express";


import {ListCursosServices} from '../../services/cursos/ListCursosServices';


class ListCursosController {
  async handle(req: Request, res: Response) {
    const service = new ListCursosServices();
    return res.json(await service.execute());
  }
}

export {ListCursosController}