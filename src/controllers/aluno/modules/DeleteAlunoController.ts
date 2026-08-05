import { Request, Response } from "express";
import { DeleteAlunoService } from "../../../services/aluno/modules/DeleteAlunoService";


class DeleteAlunoController {


  async handle(req: Request, res: Response) {


    const { id } = req.params;


    const deleteAlunoService =
      new DeleteAlunoService();



    const aluno =
      await deleteAlunoService.execute(id);



    return res.json(aluno);


  }


}


export { DeleteAlunoController };