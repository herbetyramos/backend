import { Request, Response } from "express";
import { CreateAlunoService } from "../../services/aluno/CreateAlunoService";


class CreateAlunoController {


  async handle(req: Request, res: Response) {


    const {
      nome,
      CPF,
      celular,
      email,
      Telefone_recado

    } = req.body;



    const createAlunoService =
      new CreateAlunoService();



    const aluno =
      await createAlunoService.execute({

        nome,
        CPF,
        celular,
        email,
        Telefone_recado

      });



    return res.status(201).json(aluno);


  }

}


export { CreateAlunoController };