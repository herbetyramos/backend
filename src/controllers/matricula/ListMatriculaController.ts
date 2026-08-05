import { Request, Response } from "express";


import {ListMatriculaService} from '../../services/matricula/ListMatriculaService';


class ListMatriculaController {
  async handle(req: Request, res: Response) {
    const service = new ListMatriculaService();
    return res.json(await service.execute());
  }
}

export {ListMatriculaController}