import { Request, Response } from "express";
import { UpdateAlunoService } from "../../../services/aluno/modules/UpdateAlunoService";


class UpdateAlunoController {


  async handle(req: Request, res: Response) {


    const { id } = req.params;


    const {
      nome,
      CPF,
      celular,
      email,
      Telefone_recado

    } = req.body;



    const updateAlunoService =
      new UpdateAlunoService();



    const aluno =
      await updateAlunoService.execute({

        id,

        nome,

        CPF,

        celular,

        email,

        Telefone_recado

      });



    return res.json(aluno);


  }


}


export { UpdateAlunoController };