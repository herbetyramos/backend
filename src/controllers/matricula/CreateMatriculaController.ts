import { Request, Response } from "express";

import { CreateMatriculaService } from "../../services/matricula/CreateMatriculaService";



class CreateMatriculaController {


  async handle(
    req: Request,
    res: Response
  ) {


    const {

      id_cronograma,

      id_aluno,

      confirmacao_curso,

      confirmacao_formatura,

      aprovado,

      justificativa


    } = req.body;



    const createMatriculaService =
      new CreateMatriculaService();



    try {


      const matricula =
        await createMatriculaService.execute({

          id_cronograma,

          id_aluno,

          confirmacao_curso,

          confirmacao_formatura,

          aprovado,

          justificativa

        });



      return res.status(201).json(
        matricula
      );



    } catch (error: any) {



      return res.status(400).json({

        error: error.message

      });


    }


  }


}


export {
  CreateMatriculaController
};