import { Request, Response } from "express";
import { ListAlunosCronogramaService } from "../services/ListAlunosCronogramaService";


class ListAlunosCronogramaController {

  async handle(
    req: Request,
    res: Response
  ) {

    const { id } = req.params;


    const service =
      new ListAlunosCronogramaService();


    const alunos =
      await service.execute(id);


    return res.json(alunos);

  }

}


export { ListAlunosCronogramaController };